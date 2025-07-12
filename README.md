<div align="center">
  <img src="public/genzhirehub.svg" alt="GenzHireHub Logo" width="200"/>
  <h1>GenzHireHub</h1>
  <p>The Open-Source Job Board for Undergraduate Students.</p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)
  [![GitHub issues](https://img.shields.io/github/issues/kulub/unijobs?style=for-the-badge)](https://github.com/kulub/unijobs/issues)
</div>

A modern job platform connecting Gen Z students with forward-thinking companies. Built with Next.js 15, TypeScript, and cutting-edge web technologies.

## ✨ Features

- **🚀 Dual User Experience**: Separate onboarding flows for students and companies.
- **🔐 Modern Authentication**: Secure auth with NextAuth.js and Google OAuth.
- **📱 Responsive Design**: Mobile-first approach with Tailwind CSS and Shadcn UI.
- **🌙 Dark Mode Support**: System-aware theme switching.
- **🔒 Type-Safe**: Full TypeScript implementation with strict type checking.
- **⚡️ Server Components**: Leveraging React 19 and Next.js 15 App Router.
- **📁 File Upload**: CV/Resume upload with Cloudflare R2 storage.
- **🎨 3D UI Effects**: Interactive 3D card components for enhanced UX.
- **✅ Form Validation**: Client and server-side validation with Zod.
- **🔔 Toast Notifications**: Real-time feedback with Sonner.

## 🛠️ Tech Stack & Tools

This project is built with the latest technologies to ensure a modern, fast, and scalable application.

| Category      | Technology                                                                                                                                                                                                                                                                        |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Framework**   | ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react&logoColor=61DAFB)                                                                           |
| **Language**    | ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript&logoColor=white)                                                                                                                                                                    |
| **Styling**     | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)                                                                                                                                                            |
| **UI**          | ![Shadcn UI](https://img.shields.io/badge/shadcn/ui-black?style=flat-square&logo=shadcn-ui&logoColor=white) ![Radix UI](https://img.shields.io/badge/Radix_UI-gray?style=flat-square&logo=radix-ui&logoColor=white)                                                                      |
| **Auth**        | ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-5-blue.svg?style=flat-square)                                                                                                                                                                                             |
| **Database**    | ![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-green?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)                                                                                    |
| **Storage**     | ![Cloudflare R2](https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat-square&logo=cloudflare&logoColor=white)                                                                                                                                                                 |
| **Validation**  | ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white)                                                                                                                                                                                            |
| **Deployment**  | ![Vercel](https://img.shields.io/badge/Vercel-black?style=flat-square&logo=vercel&logoColor=white)                                                                                                                                                                                  |


## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js 18+
- pnpm (recommended)
- PostgreSQL database
- Google OAuth credentials
- Cloudflare R2 bucket

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IdrisKulubi/genzhirehub
    cd unijobs
    ```
    

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the `unijobs/` directory.
    ```env
    # Database
    DATABASE_URL="postgresql://username:password@localhost:5432/genzhirehub"

    # NextAuth
    NEXTAUTH_SECRET="your-nextauth-secret-key"
    NEXTAUTH_URL="http://localhost:3000"

    # Google OAuth
    GOOGLE_CLIENT_ID="your-google-client-id"
    GOOGLE_CLIENT_SECRET="your-google-client-secret"

    # Cloudflare R2 Storage (or other S3 compatible)
    CLOUDFLARE_R2_ACCOUNT_ID="your-cloudflare-account-id"
    CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key-id"
    CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-access-key"
    CLOUDFLARE_R2_BUCKET_NAME="your-bucket-name"
    CLOUDFLARE_R2_PUBLIC_URL="https://your-bucket.r2.cloudflarestorage.com"
    ```

4.  **Set up the database:**
    Run the following commands to generate migrations and push the schema to your database.
    ```bash
    pnpm db:generate
    pnpm db:push
    ```

5.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 📂 Project Structure

The project follows a feature-based structure to keep the codebase organized and maintainable.

```
src/
├── app/
│   ├── (auth)/          # Auth routes (login, register)
│   ├── (student)/       # Student-specific dashboard and pages
│   ├── (company)/       # Company-specific dashboard and pages
│   └── api/             # API routes (e.g., NextAuth handlers)
├── components/
│   ├── forms/           # Reusable form components
│   ├── layouts/         # Layout components (e.g., headers, footers)
│   ├── ui/              # Shadcn UI components
│   └── themes/          # Theme-related components (e.g., mode toggle)
├── lib/
│   ├── actions/         # Server actions for mutations and data fetching
│   ├── auth/            # Auth configuration (NextAuth.js)
│   ├── db/              # Database utilities (Drizzle ORM)
│   ├── utils/           # Shared utility functions
│   └── validation/      # Zod schemas for data validation
└── hooks/               # Custom React hooks
```

## 🤝 Contributing

Contributions are welcome! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-amazing-feature`).
3.  Commit your changes (`git commit -m 'Add your amazing feature'`).
4.  Push to the branch (`git push origin feature/your-amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

## 🙏 Acknowledgments

A big thank you to the creators and maintainers of these amazing open-source projects:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [NextAuth.js](https://next-auth.js.org/)
