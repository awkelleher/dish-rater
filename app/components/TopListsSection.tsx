'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const foodCategories = [
  'Tacos',
  'Pizza',
  'Ramen',
  'Burrito',
  'Sandwiches',
  'Thai',
  'Fried Chicken',
  'Breakfast',
  'Empanadas',
  'Cookies',
]

// Sample data by neighborhood
const dishDataByNeighborhood: Record<string, any[]> = {
  'Downtown': [
    { rank: 1, dish: 'Margherita Pizza', restaurant: 'Razza', rating: 9.8 },
    { rank: 2, dish: 'Spicy Tonkotsu Ramen', restaurant: 'Ani Ramen', rating: 9.7 },
    { rank: 3, dish: 'Breakfast Burrito', restaurant: 'Taqueria Downtown', rating: 9.5 },
    { rank: 4, dish: 'Chicken Parm Sandwich', restaurant: 'Raval', rating: 9.4 },
    { rank: 5, dish: 'Pastrami Sandwich', restaurant: "Sam's Deli", rating: 9.3 },
    { rank: 6, dish: 'Pad Thai', restaurant: 'Bangkok Kitchen', rating: 9.2 },
    { rank: 7, dish: 'Fried Chicken', restaurant: 'South House', rating: 9.1 },
    { rank: 8, dish: 'Bacon Egg & Cheese', restaurant: "Grace O'Malley's", rating: 9.0 },
    { rank: 9, dish: 'Empanadas', restaurant: 'Empanada Lady', rating: 8.9 },
    { rank: 10, dish: 'Chocolate Chip Cookie', restaurant: 'Levain Bakery', rating: 8.8 },
  ],
  'Grove Street': [
    { rank: 1, dish: 'Carnitas Taco', restaurant: 'Tacoria', rating: 9.7 },
    { rank: 2, dish: 'Mushroom Pizza', restaurant: 'Porta', rating: 9.5 },
    { rank: 3, dish: 'Pho', restaurant: 'Pho Ngon', rating: 9.4 },
    { rank: 4, dish: 'Veggie Burger', restaurant: 'Green Soul', rating: 9.2 },
    { rank: 5, dish: 'Chicken Shawarma', restaurant: 'Shawarma Express', rating: 9.1 },
    { rank: 6, dish: 'Sushi Roll', restaurant: 'Sushi Bay', rating: 9.0 },
    { rank: 7, dish: 'BBQ Ribs', restaurant: 'Smoke House', rating: 8.9 },
    { rank: 8, dish: 'Avocado Toast', restaurant: 'Grind Cafe', rating: 8.8 },
    { rank: 9, dish: 'Falafel Wrap', restaurant: 'Medina', rating: 8.7 },
    { rank: 10, dish: 'Ice Cream', restaurant: "Torico's", rating: 8.6 },
  ],
  'Paulus Hook': [
    { rank: 1, dish: 'Fish Taco', restaurant: 'Taco Thursdays', rating: 9.6 },
    { rank: 2, dish: 'Lobster Roll', restaurant: 'Hook Seafood', rating: 9.5 },
    { rank: 3, dish: 'Burger', restaurant: 'The Hamilton', rating: 9.3 },
    { rank: 4, dish: 'Pasta Carbonara', restaurant: 'Cafe Italiano', rating: 9.2 },
    { rank: 5, dish: 'Korean Fried Chicken', restaurant: 'Seoul Kitchen', rating: 9.1 },
    { rank: 6, dish: 'Beef Pho', restaurant: 'Pho Heaven', rating: 9.0 },
    { rank: 7, dish: 'Breakfast Sandwich', restaurant: 'Morning Cafe', rating: 8.9 },
    { rank: 8, dish: 'Chorizo Taco', restaurant: 'Taco Stop', rating: 8.9 },
    { rank: 9, dish: 'Cheesesteak', restaurant: "Tony's Deli", rating: 8.8 },
    { rank: 10, dish: 'Donuts', restaurant: 'Sweet Spot', rating: 8.7 },
  ],
  'Journal Square': [
    { rank: 1, dish: 'Birria Taco', restaurant: 'La Frontera', rating: 9.5 },
    { rank: 2, dish: 'Chicken Tikka Masala', restaurant: 'Spice Palace', rating: 9.4 },
    { rank: 3, dish: 'Jerk Chicken', restaurant: 'Caribbean Grill', rating: 9.3 },
    { rank: 4, dish: 'Mofongo', restaurant: 'Puerto Rico Cafe', rating: 9.2 },
    { rank: 5, dish: 'Gyro', restaurant: 'Mediterranean Express', rating: 9.1 },
    { rank: 6, dish: 'Dumplings', restaurant: 'China House', rating: 9.0 },
    { rank: 7, dish: 'Pad See Ew', restaurant: 'Thai Corner', rating: 8.9 },
    { rank: 8, dish: 'Barbacoa Taco', restaurant: 'El Patron', rating: 8.8 },
    { rank: 9, dish: 'Pupusas', restaurant: 'El Salvador Kitchen', rating: 8.7 },
    { rank: 10, dish: 'Fried Rice', restaurant: 'Golden Wok', rating: 8.6 },
  ],
  'The Heights': [
    { rank: 1, dish: 'Carne Asada Taco', restaurant: 'Taco Express', rating: 9.4 },
    { rank: 2, dish: 'Cubano Sandwich', restaurant: 'Cuban Kitchen', rating: 9.3 },
    { rank: 3, dish: 'Tandoori Chicken', restaurant: 'Bollywood Bites', rating: 9.2 },
    { rank: 4, dish: 'Bahn Mi', restaurant: 'Saigon Cafe', rating: 9.1 },
    { rank: 5, dish: 'Cheeseburger', restaurant: 'Heights Burger', rating: 9.0 },
    { rank: 6, dish: 'Ropa Vieja', restaurant: 'Latino Kitchen', rating: 8.9 },
    { rank: 7, dish: 'Chicken Biryani', restaurant: 'India House', rating: 8.8 },
    { rank: 8, dish: 'Buffalo Wings', restaurant: 'Wing Zone', rating: 8.7 },
    { rank: 9, dish: 'Fried Plantains', restaurant: 'Tropical Eats', rating: 8.6 },
    { rank: 10, dish: 'Beef Empanada', restaurant: 'Empanada World', rating: 8.5 },
  ],
  'Newport': [
    { rank: 1, dish: 'Shrimp Taco', restaurant: 'Los Cuernos', rating: 9.1 },
    { rank: 2, dish: 'Sushi Platter', restaurant: 'Sushi Lounge', rating: 9.0 },
    { rank: 3, dish: 'Truffle Burger', restaurant: 'Gourmet Burger Co', rating: 8.9 },
    { rank: 4, dish: 'Peking Duck', restaurant: 'Dynasty', rating: 8.8 },
    { rank: 5, dish: 'Lobster Mac & Cheese', restaurant: 'Seafood Central', rating: 8.7 },
    { rank: 6, dish: 'Ribeye Steak', restaurant: 'Prime House', rating: 8.6 },
    { rank: 7, dish: 'Caesar Salad', restaurant: 'Fresh Kitchen', rating: 8.5 },
    { rank: 8, dish: 'Poke Bowl', restaurant: 'Poke Station', rating: 8.4 },
    { rank: 9, dish: 'Chicken Teriyaki', restaurant: 'Tokyo Grill', rating: 8.3 },
    { rank: 10, dish: 'Acai Bowl', restaurant: 'Juice Bar', rating: 8.2 },
  ],
}

// Sample data by food category
const dishDataByCategory: Record<string, any[]> = {
  'Tacos': [
    { rank: 1, dish: 'Al Pastor Taco', restaurant: 'Taqueria Downtown', neighborhood: 'Downtown', rating: 9.9 },
    { rank: 2, dish: 'Carnitas Taco', restaurant: 'Tacoria', neighborhood: 'Grove Street', rating: 9.7 },
    { rank: 3, dish: 'Fish Taco', restaurant: 'Taco Thursdays', neighborhood: 'Paulus Hook', rating: 9.6 },
    { rank: 4, dish: 'Birria Taco', restaurant: 'La Frontera', neighborhood: 'Journal Square', rating: 9.5 },
    { rank: 5, dish: 'Carne Asada Taco', restaurant: 'Taco Express', neighborhood: 'The Heights', rating: 9.4 },
    { rank: 6, dish: 'Lengua Taco', restaurant: 'Cinco De Mayo', neighborhood: 'Downtown', rating: 9.2 },
    { rank: 7, dish: 'Shrimp Taco', restaurant: 'Los Cuernos', neighborhood: 'Newport', rating: 9.1 },
    { rank: 8, dish: 'Vegetarian Taco', restaurant: 'Taqueria Vegana', neighborhood: 'Grove Street', rating: 9.0 },
    { rank: 9, dish: 'Chorizo Taco', restaurant: 'Taco Stop', neighborhood: 'Paulus Hook', rating: 8.9 },
    { rank: 10, dish: 'Barbacoa Taco', restaurant: 'El Patron', neighborhood: 'Journal Square', rating: 8.8 },
  ],
  'Pizza': [
    { rank: 1, dish: 'Margherita Pizza', restaurant: 'Razza', neighborhood: 'Downtown', rating: 9.8 },
    { rank: 2, dish: 'Mushroom Pizza', restaurant: 'Porta', neighborhood: 'Grove Street', rating: 9.5 },
    { rank: 3, dish: 'Pepperoni Pizza', restaurant: 'Pizza Town', neighborhood: 'Paulus Hook', rating: 9.3 },
    { rank: 4, dish: 'White Pizza', restaurant: 'Cafe Italiano', neighborhood: 'Journal Square', rating: 9.1 },
    { rank: 5, dish: 'BBQ Chicken Pizza', restaurant: 'Pizza Palace', neighborhood: 'The Heights', rating: 9.0 },
    { rank: 6, dish: 'Veggie Pizza', restaurant: 'Green Slice', neighborhood: 'Newport', rating: 8.9 },
    { rank: 7, dish: 'Buffalo Chicken Pizza', restaurant: 'Wings & Pies', neighborhood: 'Downtown', rating: 8.8 },
    { rank: 8, dish: 'Hawaiian Pizza', restaurant: 'Island Pizza', neighborhood: 'Grove Street', rating: 8.7 },
    { rank: 9, dish: 'Meat Lovers Pizza', restaurant: 'Big Tony', neighborhood: 'Paulus Hook', rating: 8.6 },
    { rank: 10, dish: 'Grandma Pizza', restaurant: "Nonna's", neighborhood: 'Journal Square', rating: 8.5 },
  ],
  'Ramen': [
    { rank: 1, dish: 'Spicy Tonkotsu Ramen', restaurant: 'Ani Ramen', neighborhood: 'Downtown', rating: 9.7 },
    { rank: 2, dish: 'Miso Ramen', restaurant: 'Ramen House', neighborhood: 'Grove Street', rating: 9.5 },
    { rank: 3, dish: 'Shoyu Ramen', restaurant: 'Tokyo Noodle', neighborhood: 'Paulus Hook', rating: 9.3 },
    { rank: 4, dish: 'Vegetarian Ramen', restaurant: 'Green Bowl', neighborhood: 'Journal Square', rating: 9.1 },
    { rank: 5, dish: 'Chicken Ramen', restaurant: 'Noodle Bar', neighborhood: 'The Heights', rating: 9.0 },
    { rank: 6, dish: 'Seafood Ramen', restaurant: 'Ocean Noodle', neighborhood: 'Newport', rating: 8.9 },
    { rank: 7, dish: 'Spicy Miso Ramen', restaurant: 'Hot Bowl', neighborhood: 'Downtown', rating: 8.8 },
    { rank: 8, dish: 'Tantanmen', restaurant: 'Spice Noodle', neighborhood: 'Grove Street', rating: 8.7 },
    { rank: 9, dish: 'Black Garlic Ramen', restaurant: 'Dark Bowl', neighborhood: 'Paulus Hook', rating: 8.6 },
    { rank: 10, dish: 'Kimchi Ramen', restaurant: 'Korea House', neighborhood: 'Journal Square', rating: 8.5 },
  ],
  'Burrito': [
    { rank: 1, dish: 'Breakfast Burrito', restaurant: 'Taqueria Downtown', neighborhood: 'Downtown', rating: 9.5 },
    { rank: 2, dish: 'Carne Asada Burrito', restaurant: 'Burrito King', neighborhood: 'Grove Street', rating: 9.3 },
    { rank: 3, dish: 'California Burrito', restaurant: 'West Coast Tacos', neighborhood: 'Paulus Hook', rating: 9.2 },
    { rank: 4, dish: 'Chicken Burrito', restaurant: 'El Pollo Loco', neighborhood: 'Journal Square', rating: 9.0 },
    { rank: 5, dish: 'Veggie Burrito', restaurant: 'Green Burrito', neighborhood: 'The Heights', rating: 8.9 },
    { rank: 6, dish: 'Carnitas Burrito', restaurant: 'Pork Paradise', neighborhood: 'Newport', rating: 8.8 },
    { rank: 7, dish: 'Shrimp Burrito', restaurant: 'Seafood Burrito Bar', neighborhood: 'Downtown', rating: 8.7 },
    { rank: 8, dish: 'Bean & Cheese Burrito', restaurant: 'Simple Burrito', neighborhood: 'Grove Street', rating: 8.6 },
    { rank: 9, dish: 'Al Pastor Burrito', restaurant: 'Pastor King', neighborhood: 'Paulus Hook', rating: 8.5 },
    { rank: 10, dish: 'Chorizo Burrito', restaurant: 'Spicy Burrito', neighborhood: 'Journal Square', rating: 8.4 },
  ],
  'Sandwiches': [
    { rank: 1, dish: 'Chicken Parm Sandwich', restaurant: 'Raval', neighborhood: 'Downtown', rating: 9.4 },
    { rank: 2, dish: 'Pastrami Sandwich', restaurant: "Sam's Deli", neighborhood: 'Downtown', rating: 9.3 },
    { rank: 3, dish: 'Cubano Sandwich', restaurant: 'Cuban Kitchen', neighborhood: 'The Heights', rating: 9.3 },
    { rank: 4, dish: 'Cheesesteak', restaurant: "Tony's Deli", neighborhood: 'Paulus Hook', rating: 8.8 },
    { rank: 5, dish: 'Lobster Roll', restaurant: 'Hook Seafood', neighborhood: 'Paulus Hook', rating: 9.5 },
    { rank: 6, dish: 'BLT', restaurant: 'Classic Deli', neighborhood: 'Grove Street', rating: 8.7 },
    { rank: 7, dish: 'Bahn Mi', restaurant: 'Saigon Cafe', neighborhood: 'The Heights', rating: 9.1 },
    { rank: 8, dish: 'Italian Sub', restaurant: 'Jersey Subs', neighborhood: 'Journal Square', rating: 8.6 },
    { rank: 9, dish: 'Turkey Club', restaurant: 'Club House', neighborhood: 'Newport', rating: 8.5 },
    { rank: 10, dish: 'Meatball Sub', restaurant: "Sal's Subs", neighborhood: 'Downtown', rating: 8.4 },
  ],
  'Thai': [
    { rank: 1, dish: 'Pad Thai', restaurant: 'Bangkok Kitchen', neighborhood: 'Downtown', rating: 9.2 },
    { rank: 2, dish: 'Pad See Ew', restaurant: 'Thai Corner', neighborhood: 'Journal Square', rating: 8.9 },
    { rank: 3, dish: 'Green Curry', restaurant: 'Thai Palace', neighborhood: 'Grove Street', rating: 8.8 },
    { rank: 4, dish: 'Massaman Curry', restaurant: 'Curry House', neighborhood: 'Paulus Hook', rating: 8.7 },
    { rank: 5, dish: 'Tom Yum Soup', restaurant: 'Spicy Thai', neighborhood: 'The Heights', rating: 8.6 },
    { rank: 6, dish: 'Drunken Noodles', restaurant: 'Noodle Thai', neighborhood: 'Newport', rating: 8.5 },
    { rank: 7, dish: 'Panang Curry', restaurant: 'Red Curry', neighborhood: 'Downtown', rating: 8.4 },
    { rank: 8, dish: 'Larb Gai', restaurant: 'Issan Kitchen', neighborhood: 'Grove Street', rating: 8.3 },
    { rank: 9, dish: 'Som Tum', restaurant: 'Papaya Salad Bar', neighborhood: 'Paulus Hook', rating: 8.2 },
    { rank: 10, dish: 'Thai Basil Chicken', restaurant: 'Basil House', neighborhood: 'Journal Square', rating: 8.1 },
  ],
  'Fried Chicken': [
    { rank: 1, dish: 'Fried Chicken', restaurant: 'South House', neighborhood: 'Downtown', rating: 9.1 },
    { rank: 2, dish: 'Korean Fried Chicken', restaurant: 'Seoul Kitchen', neighborhood: 'Paulus Hook', rating: 9.1 },
    { rank: 3, dish: 'Nashville Hot Chicken', restaurant: 'Hot Chicken', neighborhood: 'Grove Street', rating: 9.0 },
    { rank: 4, dish: 'Buttermilk Fried Chicken', restaurant: 'Southern Comfort', neighborhood: 'Journal Square', rating: 8.9 },
    { rank: 5, dish: 'Jerk Chicken', restaurant: 'Caribbean Grill', neighborhood: 'Journal Square', rating: 9.3 },
    { rank: 6, dish: 'Chicken Tenders', restaurant: 'Tender Love', neighborhood: 'The Heights', rating: 8.7 },
    { rank: 7, dish: 'Buffalo Wings', restaurant: 'Wing Zone', neighborhood: 'The Heights', rating: 8.7 },
    { rank: 8, dish: 'Chicken & Waffles', restaurant: 'Waffle House', neighborhood: 'Newport', rating: 8.6 },
    { rank: 9, dish: 'Popcorn Chicken', restaurant: 'Snack Shack', neighborhood: 'Downtown', rating: 8.5 },
    { rank: 10, dish: 'Chicken Nuggets', restaurant: 'Quick Bite', neighborhood: 'Grove Street', rating: 8.4 },
  ],
  'Breakfast': [
    { rank: 1, dish: 'Bacon Egg & Cheese', restaurant: "Grace O'Malley's", neighborhood: 'Downtown', rating: 9.0 },
    { rank: 2, dish: 'Breakfast Sandwich', restaurant: 'Morning Cafe', neighborhood: 'Paulus Hook', rating: 8.9 },
    { rank: 3, dish: 'Pancakes', restaurant: 'Pancake House', neighborhood: 'Grove Street', rating: 8.8 },
    { rank: 4, dish: 'French Toast', restaurant: 'Breakfast Club', neighborhood: 'Journal Square', rating: 8.7 },
    { rank: 5, dish: 'Avocado Toast', restaurant: 'Grind Cafe', neighborhood: 'Grove Street', rating: 8.8 },
    { rank: 6, dish: 'Omelette', restaurant: 'Egg House', neighborhood: 'The Heights', rating: 8.6 },
    { rank: 7, dish: 'Bagel', restaurant: 'Bagel World', neighborhood: 'Newport', rating: 8.5 },
    { rank: 8, dish: 'Breakfast Burrito', restaurant: 'Taqueria Downtown', neighborhood: 'Downtown', rating: 9.5 },
    { rank: 9, dish: 'Acai Bowl', restaurant: 'Juice Bar', neighborhood: 'Newport', rating: 8.2 },
    { rank: 10, dish: 'Granola', restaurant: 'Healthy Start', neighborhood: 'Paulus Hook', rating: 8.3 },
  ],
  'Empanadas': [
    { rank: 1, dish: 'Empanadas', restaurant: 'Empanada Lady', neighborhood: 'Downtown', rating: 8.9 },
    { rank: 2, dish: 'Beef Empanada', restaurant: 'Empanada World', neighborhood: 'The Heights', rating: 8.5 },
    { rank: 3, dish: 'Chicken Empanada', restaurant: 'Latin Kitchen', neighborhood: 'Grove Street', rating: 8.4 },
    { rank: 4, dish: 'Spinach Empanada', restaurant: 'Veggie Empanada', neighborhood: 'Paulus Hook', rating: 8.3 },
    { rank: 5, dish: 'Cheese Empanada', restaurant: 'Cheese House', neighborhood: 'Journal Square', rating: 8.2 },
    { rank: 6, dish: 'Ham & Cheese Empanada', restaurant: 'Ham House', neighborhood: 'Newport', rating: 8.1 },
    { rank: 7, dish: 'Corn Empanada', restaurant: 'Sweet Empanada', neighborhood: 'Downtown', rating: 8.0 },
    { rank: 8, dish: 'Pork Empanada', restaurant: 'Pork Paradise', neighborhood: 'Grove Street', rating: 7.9 },
    { rank: 9, dish: 'Seafood Empanada', restaurant: 'Ocean Empanada', neighborhood: 'Paulus Hook', rating: 7.8 },
    { rank: 10, dish: 'Veggie Empanada', restaurant: 'Green Empanada', neighborhood: 'Journal Square', rating: 7.7 },
  ],
  'Cookies': [
    { rank: 1, dish: 'Chocolate Chip Cookie', restaurant: 'Levain Bakery', neighborhood: 'Downtown', rating: 8.8 },
    { rank: 2, dish: 'Oatmeal Raisin Cookie', restaurant: 'Cookie House', neighborhood: 'Grove Street', rating: 8.6 },
    { rank: 3, dish: 'Peanut Butter Cookie', restaurant: 'PB Cookie Co', neighborhood: 'Paulus Hook', rating: 8.5 },
    { rank: 4, dish: 'Sugar Cookie', restaurant: 'Sweet Tooth', neighborhood: 'Journal Square', rating: 8.4 },
    { rank: 5, dish: 'Snickerdoodle', restaurant: 'Cinnamon House', neighborhood: 'The Heights', rating: 8.3 },
    { rank: 6, dish: 'Double Chocolate Cookie', restaurant: 'Chocolate Heaven', neighborhood: 'Newport', rating: 8.2 },
    { rank: 7, dish: 'Macadamia Nut Cookie', restaurant: 'Nut House', neighborhood: 'Downtown', rating: 8.1 },
    { rank: 8, dish: 'White Chocolate Chip Cookie', restaurant: 'White Cookie', neighborhood: 'Grove Street', rating: 8.0 },
    { rank: 9, dish: 'Ginger Cookie', restaurant: 'Spice Cookie', neighborhood: 'Paulus Hook', rating: 7.9 },
    { rank: 10, dish: 'Molasses Cookie', restaurant: 'Old School Cookies', neighborhood: 'Journal Square', rating: 7.8 },
  ],
}

export default function TopListsSection() {
  const supabase = createClient()
  const [neighborhoods, setNeighborhoods] = useState<string[]>([])
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tacos')

  // Fetch unique neighborhoods from Supabase
  useEffect(() => {
    async function fetchNeighborhoods() {
      const { data } = await supabase
        .from('restaurants')
        .select('neighborhood')
        .eq('city', 'Jersey City')
        .not('neighborhood', 'is', null)

      if (data) {
        const uniqueNeighborhoods = [...new Set(data.map(r => r.neighborhood))].sort()
        setNeighborhoods(uniqueNeighborhoods)
        if (uniqueNeighborhoods.length > 0) {
          setSelectedNeighborhood(uniqueNeighborhoods[0])
        }
      }
    }
    fetchNeighborhoods()
  }, [])

  const neighborhoodDishes = dishDataByNeighborhood[selectedNeighborhood] || []
  const categoryDishes = dishDataByCategory[selectedCategory] || []

  return (
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Neighborhood Top 10 */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                  Top 10 in
                </h3>
                <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                  <SelectTrigger className="w-fit min-w-[200px] border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg bg-background hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {neighborhoods.map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood} className="font-bold">
                        {neighborhood}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-lg text-muted-foreground">The neighborhood's absolute best dishes right now</p>
            </div>
            <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
              <div className="divide-y-2 divide-border">
                {neighborhoodDishes.map((item) => (
                  <div key={item.rank} className="p-4 hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center font-bold text-xl">
                          {item.rank}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-lg leading-tight mb-1">{item.dish}</h4>
                        <p className="text-muted-foreground text-sm">{item.restaurant}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-bold text-lg text-secondary">{item.rating}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Food Category Top 10 */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Top 10</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-fit min-w-[180px] border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-lg bg-background hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {foodCategories.map((category) => (
                      <SelectItem key={category} value={category} className="font-bold">
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <p className="text-lg text-muted-foreground">The best across all neighborhoods</p>
            </div>
            <Card className="border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-card">
              <div className="divide-y-2 divide-border">
                {categoryDishes.map((item) => (
                  <div key={item.rank} className="p-4 hover:bg-muted transition-colors cursor-pointer">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary text-primary-foreground border-2 border-foreground flex items-center justify-center font-bold text-xl">
                          {item.rank}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-lg leading-tight mb-1">{item.dish}</h4>
                        <p className="text-muted-foreground text-sm">
                          {item.restaurant} · {item.neighborhood}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="font-bold text-lg text-secondary">{item.rating}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
