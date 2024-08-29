# Project Overview

This issue tracking application was born out of a desire to transition from passive learning to active development. Recognizing that hands-on experience is invaluable in software engineering, I embarked on this project to gain practical knowledge and challenge myself with real-world development scenarios.

This project serves as a sandbox environment, allowing for experimentation, iteration, and deep learning through trial and error. It has been instrumental in bridging the gap between theoretical knowledge and practical application, becoming my go-to platform for exploring new concepts and technologies.

**Note:** The design and functionality draw inspiration from industry-leading tools such as Linear, GitHub, and JetBrains YouTrack. By emulating aspects of these established platforms, this project aims to explore and implement best practices in user interface design and functionality within the context of issue tracking systems.


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

- User authentication / authorization
- Workspace and project management (multi-tenant)
- Issue tracking and labeling
- Activity logging
- Projects

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

4. Set up the database:

   ```
   pnpm prisma db push
   ```

5. Seed database

   ```
   pnpm prisma db seed
   ```

6. Run the development server:

   ```
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

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
