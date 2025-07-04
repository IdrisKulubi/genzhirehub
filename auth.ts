import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { eq } from "drizzle-orm";
import db from "./db/drizzle";
import { users, students, companies } from "./db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role?: string;
      profileCompleted?: boolean;
      hasProfile: boolean;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
   
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Allow automatic account linking
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
 
  ],
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.provider = account.provider;
        // Ensure user ID is preserved
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.email = token.email as string;
        
        try {
          // Check if user exists in our custom users table (by email first, then ID)
          let [dbUser] = await db.select().from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);
          
          // Fallback to ID check if email lookup fails
          if (!dbUser && token.sub) {
            [dbUser] = await db.select().from(users)
              .where(eq(users.id, token.sub))
              .limit(1);
          }
          
          if (dbUser) {
            session.user.role = dbUser.role || 'student';
            
            // Check if user has profile based on role
            let hasProfile = false;
            let profileCompleted = false;

            if (dbUser.role === 'student') {
              const [studentProfile] = await db.select().from(students)
                .where(eq(students.userId, dbUser.id))
                .limit(1);
              
              if(studentProfile) {
                hasProfile = true;
                profileCompleted = studentProfile.profileCompleted || false;
              }
            } else if (dbUser.role === 'company') {
              const [companyProfile] = await db.select().from(companies)
                .where(eq(companies.userId, dbUser.id))
                .limit(1);

              if(companyProfile) {
                hasProfile = true;
                profileCompleted = companyProfile.profileCompleted || false;
              }
            }

            session.user.hasProfile = hasProfile;
            session.user.profileCompleted = profileCompleted;
          }
          
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Allow the sign-in to proceed - NextAuth will handle account linking
      if (account?.provider === "google" && user.id && user.email) {
        try {
          // Check if user exists in our custom users table by email
          const [existingUser] = await db.select().from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          if (!existingUser) {
            // Create new user entry in our custom table
            await db.insert(users).values({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              role: "student", // Default role
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          } else {
            // Update existing user with latest info
            await db.update(users)
              .set({
                name: user.name,
                image: user.image,
                updatedAt: new Date(),
              })
              .where(eq(users.email, user.email));
          }
        } catch (error) {
          console.error("Error managing user in custom table:", error);
          // Don't return false here - let NextAuth handle the authentication
          // The error might be due to race conditions with the adapter
        }
      }
      return true;
    }
  },
});
