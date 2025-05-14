# IdeaVault

A modern web application for managing and organizing your creative ideas.

## Features

- Create and manage ideas with text, images, and tags
- Swipe-based interface for quick actions (favorite/archive)
- Mood-based categorization
- Image storage integration
- Filter and search capabilities
- Responsive design

## Tech Stack

- Next.js 14+ with TypeScript
- React
- Supabase (PostgreSQL, Storage, Auth)
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/app` - Next.js app directory with pages and API routes
- `/src/components` - Reusable React components
- `/src/lib` - Utility functions and configurations
- `/src/types` - TypeScript type definitions
- `/supabase.sql` - Database schema

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
