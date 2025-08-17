"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Save, X, Package, DollarSign, BarChart3, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/hooks/use-auth"
import { ImageUpload } from "@/components/image-upload"

// Mock inventory data (same as customer view but with admin capabilities)
const initialInventory = [
  {
    id: 1,
    name: "Hennessy VS Cognac",
    category: "Cognac",
    price: 49.99,
    stock: 12,
    description: "Premium French cognac with rich, smooth flavor",
    image: "/elegant-cognac.png",
    abv: "40%",
    cost: 35.0,
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
    cost: 28.0,
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
    cost: 65.0,
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
    cost: 40.0,
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
    cost: 150.0,
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
    cost: 22.0,
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
    cost: 18.0,
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
    cost: 14.0,
  },
]

const categories = ["Whiskey", "Vodka", "Gin", "Rum", "Tequila", "Cognac", "Champagne", "Beer", "Wine"]

export default function AdminDashboard() {
  const { username, logout } = useAuth()

  const [inventory, setInventory] = useState(initialInventory)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    abv: "",
    cost: "",
  })

  // Calculate dashboard stats
  const totalProducts = inventory.length
  const totalValue = inventory.reduce((sum, item) => sum + item.price * item.stock, 0)
  const lowStockItems = inventory.filter((item) => item.stock <= 5).length
  const totalProfit = inventory.reduce((sum, item) => sum + (item.price - item.cost) * item.stock, 0)

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.price) {
      const product = {
        id: Math.max(...inventory.map((p) => p.id)) + 1,
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        stock: Number.parseInt(newProduct.stock) || 0,
        cost: Number.parseFloat(newProduct.cost) || 0,
      }
      setInventory([...inventory, product])
      setNewProduct({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: "",
        abv: "",
        cost: "",
      })
      setIsAddingProduct(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product })
  }

  const handleSaveEdit = () => {
    setInventory(inventory.map((item) => (item.id === editingProduct.id ? editingProduct : item)))
    setEditingProduct(null)
  }

  const handleDeleteProduct = (id) => {
    setInventory(inventory.filter((item) => item.id !== id))
  }

  const handleNewProductImageChange = (imageUrl: string) => {
    setNewProduct({ ...newProduct, image: imageUrl })
  }

  const handleEditProductImageChange = (imageUrl: string) => {
    setEditingProduct({ ...editingProduct, image: imageUrl })
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-background">
        {/* Admin Header */}
        <header className="bg-primary text-primary-foreground shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Green Road Liquor - Admin</h1>
                <p className="text-primary-foreground/80 mt-1">Inventory Management System</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span>Welcome, {username}</span>
                </div>
                <Button variant="secondary" asChild>
                  <a href="/">View Store</a>
                </Button>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalProducts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-destructive">{lowStockItems}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Potential Profit</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">${totalProfit.toFixed(2)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Low Stock Alert */}
              {lowStockItems > 0 && (
                <Card className="border-destructive">
                  <CardHeader>
                    <CardTitle className="text-destructive">Low Stock Alert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {inventory
                        .filter((item) => item.stock <= 5)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between p-2 bg-destructive/10 rounded"
                          >
                            <span className="font-medium">{item.name}</span>
                            <Badge variant="destructive">{item.stock} left</Badge>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Inventory Management Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProduct.category}
                          onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Cost ($)</Label>
                        <Input
                          id="cost"
                          type="number"
                          step="0.01"
                          value={newProduct.cost}
                          onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input
                          id="stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abv">ABV (%)</Label>
                        <Input
                          id="abv"
                          value={newProduct.abv}
                          onChange={(e) => setNewProduct({ ...newProduct, abv: e.target.value })}
                          placeholder="40%"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                          placeholder="Enter product description"
                          rows={3}
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label>Product Image</Label>
                        <ImageUpload value={newProduct.image} onChange={handleNewProductImageChange} />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddProduct}>Add Product</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Inventory Table */}
              <div className="grid gap-4">
                {inventory.map((product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      {editingProduct && editingProduct.id === product.id ? (
                        // Edit Mode
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-4">
                            <div>
                              <Label>Product Name</Label>
                              <Input
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Category</Label>
                              <Select
                                value={editingProduct.category}
                                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                      {cat}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <Label>Price ($)</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={editingProduct.price}
                                  onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={editingProduct.stock}
                                  onChange={(e) =>
                                    setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) })
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                rows={3}
                              />
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>Image</Label>
                              <ImageUpload value={editingProduct.image} onChange={handleEditProductImageChange} />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleSaveEdit} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                              <Button variant="outline" onClick={() => setEditingProduct(null)} size="sm">
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="flex items-center gap-6">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <Badge variant="secondary">{product.category}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Price</p>
                              <p className="font-semibold">${product.price}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Stock</p>
                              <Badge
                                variant={
                                  product.stock > 10 ? "default" : product.stock > 5 ? "secondary" : "destructive"
                                }
                              >
                                {product.stock} units
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
