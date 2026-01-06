import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateNeighborhoods() {
  console.log('Starting neighborhood update...')

  // Read the CSV file
  const csvPath = path.join(process.cwd(), 'jcfoodmap_restaurants_with_neighborhood.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n')

  // Skip header row
  const dataLines = lines.slice(1).filter(line => line.trim())

  let successCount = 0
  let errorCount = 0
  let notFoundCount = 0

  for (const line of dataLines) {
    // Parse CSV line (handle commas in quotes)
    const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
    if (!matches || matches.length < 7) continue

    const restaurant = matches[0].replace(/"/g, '').trim()
    const neighborhood = matches[6].replace(/"/g, '').trim()

    try {
      // Find restaurant by name
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id, name, neighborhood')
        .eq('name', restaurant)
        .eq('city', 'Jersey City')
        .single()

      if (existingRestaurant) {
        // Update neighborhood
        const { error } = await supabase
          .from('restaurants')
          .update({ neighborhood })
          .eq('id', existingRestaurant.id)

        if (error) {
          console.error(`Error updating ${restaurant}:`, error.message)
          errorCount++
        } else {
          console.log(`✓ Updated ${restaurant} → ${neighborhood}`)
          successCount++
        }
      } else {
        console.log(`⚠ Restaurant not found: ${restaurant}`)
        notFoundCount++
      }
    } catch (err) {
      console.error(`Error processing ${restaurant}:`, err)
      errorCount++
    }
  }

  console.log('\n=== Update Complete ===')
  console.log(`Successfully updated: ${successCount}`)
  console.log(`Not found: ${notFoundCount}`)
  console.log(`Errors: ${errorCount}`)
}

updateNeighborhoods()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
