# DishRate - Complete Setup Guide

## ✅ What You've Done So Far
1. Created Supabase project
2. Ran the database schema SQL

## 🚀 Next Steps

### Step 1: Configure Supabase Storage (5 minutes)

1. Go to your Supabase Dashboard → **Storage**
2. Click **New bucket**
3. Set:
   - **Name:** `dish-photos`
   - **Public bucket:** Toggle ON
4. Click **Create bucket**
5. Click on the bucket → **Policies** → **New policy**
6. Choose **Allow public read access** (users can view photos)
7. Add another policy for **Authenticated users can upload**

### Step 2: Get Your Supabase Credentials

1. In Supabase Dashboard → **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 3: Set Up Your Local Project

1. **Create `.env.local` file** in the project root:
```bash
cd dish-rate
cp .env.local.example .env.local
```

2. **Edit `.env.local`** and paste your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 4: Install Dependencies & Run

```bash
npm install
npm run dev
```

Open http://localhost:3000 - you should see the homepage!

## 🎯 Test Your Setup

### Test 1: Sign Up
1. Go to http://localhost:3000
2. Click **Sign up**
3. Create an account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. You should be redirected to `/explore`

### Test 2: Check Database
1. Go to Supabase Dashboard → **Table Editor**
2. Click **profiles** table
3. You should see your new user!

## 📂 What's Been Built

### Pages
- **/** - Homepage with hero section
- **/auth/login** - Login page
- **/auth/signup** - Signup page with profile creation
- **/explore** - Browse top-rated dishes (empty for now)

### Database
- All 7 tables created with RLS policies
- Auto-updating dish ratings via triggers
- Views for top dishes and user feed

### Authentication
- Supabase Auth with email/password
- Automatic profile creation on signup
- Session management via middleware

## 🛠 Next Features to Build

### Priority 1: Core Functionality
1. **Add Restaurant Page** (`/restaurants/new`)
   - Form to create new restaurants
   - Fields: name, address, neighborhood, cuisine

2. **Restaurant Detail Page** (`/restaurants/[id]`)
   - Show restaurant info
   - List all dishes
   - Button to add new dish

3. **Add Dish Form**
   - Add dishes to a restaurant
   - Fields: name, description, category, price

4. **Rate Dish Form**
   - 1-5 star rating
   - Optional review text
   - Visit date

### Priority 2: Enhanced Features
5. **Dish Detail Page** (`/dishes/[id]`)
   - All ratings for that dish
   - Photo gallery
   - Average rating breakdown

6. **Photo Upload**
   - Upload to Supabase Storage
   - Link to dishes
   - Display in gallery

7. **Search**
   - Search restaurants by name, cuisine, neighborhood
   - Search dishes by name

8. **User Profile** (`/profile/[username]`)
   - User's ratings
   - Uploaded photos
   - Follow/unfollow button

## 🎨 Using Cursor AI Tips

Since you're using Cursor, here are some helpful prompts:

1. **"Create an add restaurant form with Supabase insert"**
2. **"Build a restaurant detail page that fetches from Supabase"**
3. **"Make a star rating component in React"**
4. **"Create a photo upload component using Supabase Storage"**

## 🐛 Troubleshooting

### "Supabase client error"
- Check `.env.local` has correct URL and key
- Restart dev server: `npm run dev`

### "Cannot insert into profiles"
- Check RLS policies in Supabase Dashboard
- Make sure user is authenticated

### "No dishes showing"
- Database is empty! Add some test data:
```sql
-- In Supabase SQL Editor
INSERT INTO restaurants (name, address, city, neighborhood, cuisine_type)
VALUES ('Joe''s Pizza', '7 Carmine St', 'New York', 'Greenwich Village', ARRAY['Pizza', 'Italian']);
```

## 📞 Need Help?

- Check Supabase docs: https://supabase.com/docs
- Next.js docs: https://nextjs.org/docs
- Check the README.md for project structure

---

**You're all set! Start building.** 🚀
