# GenzHireHub

A modern job platform connecting Gen Z students with forward-thinking companies. Built with Next.js 15, TypeScript, and cutting-edge web technologies.

## 🚀 Features

- **Dual User Experience**: Separate onboarding flows for students and companies
- **Modern Authentication**: Secure auth with NextAuth.js and Google OAuth
- **Responsive Design**: Mobile-first approach with Tailwind CSS and Shadcn UI
- **Dark Mode Support**: System-aware theme switching
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Server Components**: Leveraging React 19 and Next.js 15 App Router
- **File Upload**: CV/Resume upload with Cloudflare R2 storage
- **3D UI Effects**: Interactive 3D card components for enhanced UX
- **Form Validation**: Client and server-side validation with Zod
- **Toast Notifications**: Real-time feedback with Sonner

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI + Radix UI
- **Authentication**: NextAuth.js
- **Database**: Drizzle ORM with PostgreSQL
- **Storage**: Cloudflare R2 for file uploads
- **Validation**: Zod
- **Notifications**: Sonner
- **Deployment**: Vercel


## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Google OAuth credentials
- Cloudflare R2 bucket (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/genzhirehub.git
   cd genzhirehub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/genzhirehub"
   
   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Cloudflare R2 Storage
   CLOUDFLARE_R2_ACCOUNT_ID="your-cloudflare-account-id"
   CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
   CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
   CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
   CLOUDFLARE_R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"
   ```

4. **Set up the database**
   ```bash
   # Generate database migrations
   pnpm db:generate
   
   # Push schema to database
   pnpm db:push
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:generate  # Generate Drizzle migrations
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## 🔧 Configuration

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

### Cloudflare R2 Setup

1. Create a Cloudflare account
2. Go to R2 Object Storage
3. Create a new bucket
4. Generate API tokens with R2 permissions
5. Configure CORS settings for file uploads

### Database Setup

The project uses PostgreSQL with Drizzle ORM. You can use:
- Local PostgreSQL installation
- Docker container
- Cloud providers (Neon, Supabase, PlanetScale)

Example Docker setup:
```bash
docker run --name genzhirehub-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=genzhirehub \
  -p 5432:5432 \
  -d postgres:15
```

## 🎨 UI Components

The project uses Shadcn UI components with custom additions:

- **3D Cards**: Interactive cards with mouse-responsive 3D effects
- **Theme System**: Dark/light mode with system preference detection
- **Form Components**: Validated forms with real-time feedback
- **File Upload**: Drag-and-drop CV upload with progress tracking

## 🔐 Authentication Flow

1. **Landing Page**: Unauthenticated users see the marketing site
2. **Login**: Google OAuth integration with role selection
3. **Role Selection**: Choose between Student or Company
4. **Profile Creation**: Detailed onboarding based on selected role
5. **Success Page**: Confirmation and next steps

## 📱 Responsive Design

- **Mobile-first**: Optimized for mobile devices
- **Breakpoints**: Tailwind CSS responsive utilities
- **Touch-friendly**: Appropriate touch targets and gestures
- **Performance**: Optimized images and lazy loading

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication library

## 📞 Support

For support, email hello@genzhirehub.com or join our community discussions.

---

Built with ❤️ by the GenzHireHub team
