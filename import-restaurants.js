const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  
  const restaurants = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = line.split(',');
    const restaurant = {};
    
    headers.forEach((header, index) => {
      restaurant[header] = values[index];
    });
    
    restaurants.push(restaurant);
  }
  
  return restaurants;
}

async function importRestaurants() {
  console.log('Starting restaurant import...\n');
  
  // Parse CSV
  const csvPath = path.join(process.cwd(), 'jcfoodmap_restaurants_with_neighborhood.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at: ${csvPath}`);
    console.error('Please place the jcfoodmap_restaurants_with_neighborhood.csv file in your project root directory');
    process.exit(1);
  }
  
  const restaurants = parseCSV(csvPath);
  
  console.log(`Found ${restaurants.length} restaurants to import\n`);
  
  let successCount = 0;
  let errorCount = 0;
  let skipCount = 0;
  
  for (const restaurant of restaurants) {
    try {
      // Check if restaurant already exists
      const { data: existing } = await supabase
        .from('restaurants')
        .select('id')
        .eq('name', restaurant.restaurant)
        .eq('address', restaurant.address)
        .maybeSingle();
      
      if (existing) {
        console.log(`⊘ Skipping duplicate: ${restaurant.restaurant}`);
        skipCount++;
        continue;
      }
      
      // Prepare restaurant data
      const restaurantData = {
        name: restaurant.restaurant,
        address: restaurant.address,
        city: 'Jersey City',
        state: 'NJ',
        zip_code: restaurant.zip_code || null,
        latitude: restaurant.lat ? parseFloat(restaurant.lat) : null,
        longitude: restaurant.lon ? parseFloat(restaurant.lon) : null,
        neighborhood: restaurant.neighborhood || null,
      };
      
      // Insert restaurant
      const { data, error } = await supabase
        .from('restaurants')
        .insert(restaurantData)
        .select()
        .single();
      
      if (error) {
        console.error(`✗ Error inserting ${restaurant.restaurant}:`, error.message);
        errorCount++;
      } else {
        console.log(`✓ Imported: ${restaurant.restaurant} (${restaurant.neighborhood})`);
        successCount++;
      }
      
    } catch (error) {
      console.error(`✗ Error processing ${restaurant.restaurant}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n========================================');
  console.log('          IMPORT SUMMARY');
  console.log('========================================');
  console.log(`Total restaurants:      ${restaurants.length}`);
  console.log(`Successfully imported:  ${successCount}`);
  console.log(`Skipped (duplicates):   ${skipCount}`);
  console.log(`Errors:                 ${errorCount}`);
  console.log('========================================\n');
}

// Run the import
importRestaurants()
  .then(() => {
    console.log('Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed:', error);
    process.exit(1);
  });
