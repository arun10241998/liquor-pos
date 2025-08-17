"use client"

import { useState } from "react"
import { Search, MapPin, Phone, Clock, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock inventory data
const inventory = [
  {
    id: 1,
    name: "Hennessy VS Cognac",
    category: "Cognac",
    price: 49.99,
    stock: 12,
    description: "Premium French cognac with rich, smooth flavor",
    image: "/elegant-cognac.png",
    abv: "40%",
  },
  {
    id: 2,
    name: "Grey Goose Vodka",
    category: "Vodka",
    price: 39.99,
    stock: 8,
    description: "Ultra-premium French vodka, smooth and crisp",
    image: "/grey-goose-vodka.png",
    abv: "40%",
  },
  {
    id: 3,
    name: "Macallan 12 Year Scotch",
    category: "Whiskey",
    price: 89.99,
    stock: 5,
    description: "Single malt Scotch whisky aged 12 years",
    image: "/macallan-whiskey.png",
    abv: "43%",
  },
  {
    id: 4,
    name: "Patron Silver Tequila",
    category: "Tequila",
    price: 54.99,
    stock: 15,
    description: "100% agave tequila, crystal clear and smooth",
    image: "/patron-silver-tequila.png",
    abv: "40%",
  },
  {
    id: 5,
    name: "Dom Pérignon Champagne",
    category: "Champagne",
    price: 199.99,
    stock: 3,
    description: "Luxury French champagne, vintage quality",
    image: "/champagne-bottle.png",
    abv: "12.5%",
  },
  {
    id: 6,
    name: "Jack Daniels Old No. 7",
    category: "Whiskey",
    price: 29.99,
    stock: 20,
    description: "Tennessee whiskey, charcoal mellowed",
    image: "/whiskey-bottle.png",
    abv: "40%",
  },
  {
    id: 7,
    name: "Bombay Sapphire Gin",
    category: "Gin",
    price: 24.99,
    stock: 10,
    description: "Premium London dry gin with botanical blend",
    image: "/bombay-sapphire-gin.png",
    abv: "47%",
  },
  {
    id: 8,
    name: "Bacardi Superior Rum",
    category: "Rum",
    price: 19.99,
    stock: 18,
    description: "White rum, smooth and mixable",
    image: "/bacardi-white-rum.png",
    abv: "40%",
  },
]

const categories = ["All", "Whiskey", "Vodka", "Gin", "Rum", "Tequila", "Cognac", "Champagne"]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    return matchesSearch && matchesCategory && item.stock > 0
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Green Road Liquor</h1>
              <p className="text-primary-foreground/80 mt-1">Premium spirits & fine wines</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>2181 S Green Rd, South Euclid, OH 44121</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(216) 331-0008</span>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <a href="/login" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Store Hours */}
      <div className="bg-secondary/50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Today's Hours:</span>
            <span>9 AM - 10:30 PM</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-muted/30 flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.abv}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">${product.price}</span>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Stock: {product.stock}</div>
                    <Badge
                      variant={product.stock > 10 ? "default" : product.stock > 5 ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {product.stock > 10 ? "In Stock" : product.stock > 5 ? "Low Stock" : "Limited"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No products found matching your search.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Store Hours</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Monday - Thursday:</span>
                  <span>9 AM - 10 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Friday - Saturday:</span>
                  <span>9 AM - 10:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>10 AM - 9 PM</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>2181 S Green Rd</p>
                <p>South Euclid, OH 44121</p>
                <p>(216) 331-0008</p>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Green Road Liquor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
