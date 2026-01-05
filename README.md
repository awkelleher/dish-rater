# DishRate - Rate Dishes, Not Restaurants

A Next.js app for rating individual dishes at restaurants, helping diners make better ordering decisions and restaurants understand what's working on their menu.

## Tech Stack

- **Frontend:** Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (recommended)

## Getting Started

### 1. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `schema.sql` in the SQL Editor
3. Create a storage bucket named `dish-photos` with public access:
   - Go to Storage → Create bucket
   - Name: `dish-photos`
   - Public: Yes
4. Get your API credentials from Settings → API

### 2. Configure Environment Variables

Create `.env.local` in the project root:

```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
dish-rate/
├── app/
│   ├── auth/
│   │   ├── login/          # Login page
│   │   └── signup/         # Signup page
│   ├── explore/            # Browse top dishes
│   ├── page.tsx            # Homepage
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/
│   └── supabase/
│       ├── client.ts       # Client-side Supabase
│       └── server.ts       # Server-side Supabase
├── types/
│   └── database.types.ts   # TypeScript types
└── middleware.ts           # Auth middleware
```

## Key Features

### MVP (Current)
- ✅ User authentication (signup/login)
- ✅ Browse top-rated dishes
- ✅ Database schema with RLS

### Next Steps
- [ ] Add restaurants
- [ ] Add dishes to restaurants
- [ ] Rate dishes (1-5 stars + review)
- [ ] Upload dish photos
- [ ] Restaurant detail pages
- [ ] Dish detail pages
- [ ] User profiles
- [ ] Search functionality

## Database Schema Highlights

- **profiles** - User profiles with usernames
- **restaurants** - Restaurant info with location/cuisine
- **dishes** - Menu items with auto-calculated ratings
- **ratings** - User reviews (1 per user per dish)
- **photos** - Dish images
- **follows** - Social following system
- **helpful_votes** - Mark reviews as helpful

## Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

## Contributing

This is a personal project but suggestions are welcome!

## License

MIT
