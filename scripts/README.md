# Update Neighborhoods Script

This script updates the `neighborhood` column in the Supabase `restaurants` table with the correct neighborhood names from the CSV file.

## Prerequisites

Before running this script, you need to add your Supabase service role key to your `.env.local` file:

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the "service_role" key (NOT the anon key)
4. Add it to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important:** The service role key bypasses Row Level Security (RLS) and should NEVER be committed to git or exposed to the client. It's only used for this admin script.

## Running the Script

```bash
npm run update-neighborhoods
```

## What It Does

1. Reads `jcfoodmap_restaurants_with_neighborhood.csv`
2. For each restaurant in the CSV:
   - Finds the matching restaurant in Supabase by name and city
   - Updates the `neighborhood` column with the correct value from column G of the CSV
3. Prints a summary of successful updates, not found restaurants, and errors

## Output

The script will show:
- ✓ for successful updates
- ⚠ for restaurants not found in the database
- Errors for any issues

At the end, you'll see a summary with counts of each.
