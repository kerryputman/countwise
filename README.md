# BTS Tour Venue Directory

A simple venue directory app to help ARMY find venue policies and information for BTS tour dates.

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Local Development Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase URL and anon key from your Supabase project settings

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

SQL scripts are located in the `sql/` folder:

1. **schema.sql** - Creates the database tables
2. **sample-data.sql** - Adds sample venues for testing

Run these in your Supabase SQL Editor in order.

## Project Structure

```
/sql              # Database schema and seed data
/src
  /app            # Next.js app directory
  /components     # React components
  /lib            # Utility functions (Supabase client, etc.)
```

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repo to Vercel and add your environment variables in the project settings.

---

Built with 💜 for ARMY
