import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addAreaColumn() {
  console.log('Adding area column to restaurants table...')

  // Execute SQL to add the area column
  const { error } = await supabase.rpc('exec_sql', {
    sql: 'ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS area TEXT;'
  })

  if (error) {
    console.error('Error adding area column:', error)
    console.log('\nNote: You may need to add the area column manually in Supabase:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Table Editor → restaurants')
    console.log('3. Add a new column named "area" with type "text"')
    process.exit(1)
  } else {
    console.log('✓ Area column added successfully!')
  }
}

addAreaColumn()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    console.log('\nPlease add the area column manually in Supabase:')
    console.log('1. Go to your Supabase dashboard')
    console.log('2. Navigate to Table Editor → restaurants')
    console.log('3. Add a new column named "area" with type "text"')
    process.exit(1)
  })
