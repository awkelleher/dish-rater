import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateAreas() {
  console.log('Starting area update...')

  // Build a map of neighborhood to area from the area CSV
  const neighborhoodToArea = new Map<string, string>()
  const areaCsvPath = path.join(process.cwd(), 'jcfoodmap_area_mapped.csv')

  if (fs.existsSync(areaCsvPath)) {
    const areaCsvContent = fs.readFileSync(areaCsvPath, 'utf-8')
    const areaLines = areaCsvContent.split('\n')

    // Parse the area CSV to build the map
    // CSV structure: Geo Point, Geo Shape, cartodb_id, area_sq_ft, acres, area, neighborhood, color
    // area is column F (index 5), neighborhood is column G (index 6)
    for (let i = 1; i < areaLines.length; i++) {
      const line = areaLines[i]
      if (!line.trim()) continue

      // Split by commas and get last 3 fields (area, neighborhood, color)
      const parts = line.split(',')
      if (parts.length >= 8) {
        const area = parts[parts.length - 3].trim()
        const neighborhood = parts[parts.length - 2].trim()

        if (neighborhood && area) {
          neighborhoodToArea.set(neighborhood, area)
        }
      }
    }

    console.log(`Loaded ${neighborhoodToArea.size} neighborhood-to-area mappings`)
    console.log('Sample mappings:')
    let count = 0
    for (const [neighborhood, area] of neighborhoodToArea.entries()) {
      if (count < 5) {
        console.log(`  ${neighborhood} → ${area}`)
        count++
      }
    }
  } else {
    console.error('Area CSV file not found!')
    process.exit(1)
  }

  // Read the restaurants CSV
  const csvPath = path.join(process.cwd(), 'jcfoodmap_restaurants_with_neighborhood.csv')
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  const lines = csvContent.split('\n')

  // Skip header row
  const dataLines = lines.slice(1).filter(line => line.trim())

  let successCount = 0
  let errorCount = 0
  let notFoundCount = 0
  let noAreaCount = 0

  for (const line of dataLines) {
    // Parse CSV line (handle commas in quotes)
    const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
    if (!matches || matches.length < 7) continue

    const restaurant = matches[0].replace(/"/g, '').trim()
    const neighborhood = matches[6].replace(/"/g, '').trim()

    // Get the area for this neighborhood
    const area = neighborhoodToArea.get(neighborhood)

    if (!area) {
      noAreaCount++
      continue
    }

    try {
      // Find restaurant by name
      const { data: existingRestaurant } = await supabase
        .from('restaurants')
        .select('id, name, neighborhood')
        .eq('name', restaurant)
        .eq('city', 'Jersey City')
        .single()

      if (existingRestaurant) {
        // Update area
        const { error } = await supabase
          .from('restaurants')
          .update({ area })
          .eq('id', existingRestaurant.id)

        if (error) {
          console.error(`Error updating ${restaurant}:`, error.message)
          errorCount++
        } else {
          console.log(`✓ Updated ${restaurant} (${neighborhood}) → ${area}`)
          successCount++
        }
      } else {
        notFoundCount++
      }
    } catch (err) {
      console.error(`Error processing ${restaurant}:`, err)
      errorCount++
    }
  }

  console.log('\n=== Update Complete ===')
  console.log(`Successfully updated: ${successCount}`)
  console.log(`Not found in database: ${notFoundCount}`)
  console.log(`No area mapping found: ${noAreaCount}`)
  console.log(`Errors: ${errorCount}`)
}

updateAreas()
  .then(() => {
    console.log('Done!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('Fatal error:', err)
    process.exit(1)
  })
