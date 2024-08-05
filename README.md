# Issue Tracker

I started this project because I was tired of watching tutorials and wanted to actually build something. I figured the best way to learn was to dive in headfirst. So, here we are – my very own issue tracking app.

I didn't need another bug tracker. I needed playground to make mistakes, break things, and figure out how all these fancy technologies actually work together. This project has been my late-night companion, weekend obsession, and the cause of both frustrating debug sessions and A-ha! moments.

It's not perfect, and definitely not meant to compete with existing trackers out there, but it's mine, and I've learned more about building this than I ever did from tutorials.

Feel free to poke around, maybe even learn something along with me.

I should mention that much of the design and functionality is inspired by Linear and Jetbrains YouTrack. They've got some seriously cool ones, and I thought recreating aspects of them would be a great way to learn.

## Technologies

- Next.js 14
- TypeScript
- Prisma w/ Zenstack (this one rocks!)
- PostgreSQL
- TailwindCSS
- React Hook Form
- Zod
- NextAuth.js

## Features

- User authentication / authorization
- Workspace and project management (multi-tenant)
- Issue tracking and labeling
- Activity logging

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm/bun
- PostgreSQL database

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/bug-tracker.git
   cd bug-tracker
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

4. Set up the database:

   ```
   pnpm prisma db push
   ```

5. Run the development server:

   ```
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js app router and page components
  - `_components/`: Shared components specific to routes
  - `_actions/`: Server actions for routes
- `components/`: Reusable React components
- `lib/`: Utility functions and shared logic
- `prisma/`: Prisma schema and migrations
- `public/`: Static assets
- `styles/`: Global styles

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
