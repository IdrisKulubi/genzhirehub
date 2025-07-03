import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import db from "./db/drizzle";
import { users } from "./db/schema";

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
          // Check if user exists in our custom users table
          const user = await db.select().from(users)
            .where(eq(users.id, token.sub))
            .limit(1);
          
        } catch (error) {
          console.error("Error fetching user:", error);
        }
          
          
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow sign in - profile will be created during application submission
      return true;
    }
  },
});
