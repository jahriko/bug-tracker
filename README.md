# Project Overview

An issue tracking and project management application built with modern web technologies. It provides an intuitive interface for managing tasks, tracking issues, and collaborating with your team across multiple projects and workspaces.

## Technologies

- React
- Next.js 14
- TypeScript
- Prisma with Zenstack 
- PostgreSQL
- TailwindCSS
- React Hook Form
- Zod
- Supabase

## Features

- User authentication and authorization
- Workspace and project management (multi-tenant)
- Issue tracking with labels, priorities, and statuses
- Activity logging
- Discussion forums
- Rich text editing for issue descriptions and comments

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm or bun
- PostgreSQL database

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/jahriko/issue-tracker.git
   cd issue-tracker
   ```

2. Install dependencies:

   ```
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/bug_tracker"
   AUTH_SECRET="your-secret-key"
   ```


4. Generate and set up the database:

   ```
   pnpm zenstack generate
   ```

   ```
   pnpm prisma db push
   ```

6. Seed database

   ```
   pnpm prisma db seed
   ```

7. Run the development server:

   ```
   pnpm dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js app router and page components
  - `(platform)/`: Platform-specific routes and components
    - `(auth)/`: Authentication-related components and routes
    - `(home)/`: Main application routes and components
  - `_components/`: Shared components specific to routes
  - `_actions/`: Server actions for routes
- `components/`: Reusable React components
- `lib/`: Utility functions and shared logic
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Design inspiration from Linear, Github, and Jetbrains YouTrack
- Icons from Heroicons and Lucide React
- UI components from Radix UI and Headless UI
