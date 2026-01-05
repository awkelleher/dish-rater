# Hood Eats Rebrand - Setup Instructions

## Files to Download & Place:

### 1. Logo Image
**logo.jpg** → Place in `public/logo.jpg`
- This is your Hood Eats logo
- Must be in the public folder so Next.js can serve it

### 2. Landing Page
**landing-page.tsx** → Replace `app/page.tsx`
- Beautiful hero section with full logo
- "Bite the Block" tagline
- How It Works section
- Neighborhood showcase
- CTAs to explore and sign up

### 3. Updated Headers
**Header-branded.tsx** → Replace `app/components/Header.tsx`
**ClientHeader-branded.tsx** → Replace `app/components/ClientHeader.tsx`
- Both now show Hood Eats logo instead of text
- Orange gradient login button
- Links to home (/)

## Quick Setup:

```bash
# 1. Place logo in public folder
mv logo.jpg public/logo.jpg

# 2. Replace pages
mv landing-page.tsx app/page.tsx
mv Header-branded.tsx app/components/Header.tsx
mv ClientHeader-branded.tsx app/components/ClientHeader.tsx
```

## What Changed:

✅ **New Landing Page at /** 
- Hero with full Hood Eats logo
- "Rate every taco in Jersey City" headline
- Orange/red gradient CTAs
- How It Works section
- Neighborhood grid
- Professional, polished design

✅ **Branded Headers**
- Logo in top left (links to home)
- Smaller, cleaner header
- Orange gradient login button (matches brand)
- All "DishRate" text replaced with Hood Eats branding

✅ **Color Scheme**
- Orange (#E67E22) to Red (#DC2626) gradients
- Matches your logo perfectly
- Used on CTAs and accents

## Navigation Flow:

- `/` → Landing page (public)
- `/explore` → Browse tacos (public viewing, login to rate)
- `/restaurants/new` → Add dish (requires login)
- `/dishes/[id]` → Dish details and rating

## Next Steps:

1. Test the landing page
2. Check if logo displays correctly in header
3. Make sure all links work
4. Consider updating page titles and meta descriptions with "Hood Eats"

The rebrand is complete! 🌮🏙️
