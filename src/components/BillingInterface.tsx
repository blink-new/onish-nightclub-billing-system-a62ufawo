import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { blink } from '../blink/client'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Receipt,
  User,
  ShoppingCart
} from 'lucide-react'

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock_quantity: number
}

interface CartItem {
  product: Product
  quantity: number
  discount: number
  lineTotal: number
}

interface Member {
  id: string
  member_number: string
  full_name: string
  membership_type: string
}

export const BillingInterface: React.FC = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [memberSearch, setMemberSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [productFilter, setProductFilter] = useState('all')

  useEffect(() => {
    loadProducts()
  }, [])

  useEffect(() => {
    if (memberSearch.length >= 2) {
      searchMembers()
    } else {
      setSearchResults([])
    }
  }, [memberSearch])

  const loadProducts = async () => {
    try {
      const productList = await blink.db.products.list({
        where: { is_active: "1" },
        orderBy: { category: 'asc' }
      })
      setProducts(productList)
    } catch (error) {
      console.error('Error loading products:', error)
    }
  }

  const searchMembers = async () => {
    try {
      const members = await blink.db.members.list({
        where: { 
          status: 'active'
        }
      })
      
      const filtered = members.filter(member => 
        member.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.member_number.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.phone?.includes(memberSearch)
      )
      
      setSearchResults(filtered.slice(0, 5))
    } catch (error) {
      console.error('Error searching members:', error)
    }
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id)
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: CartItem = {
        product,
        quantity: 1,
        discount: 0,
        lineTotal: product.price
      }
      setCart([...cart, newItem])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const lineTotal = (item.product.price * newQuantity) * (1 - item.discount / 100)
        return { ...item, quantity: newQuantity, lineTotal }
      }
      return item
    }))
  }

  const updateDiscount = (productId: string, discount: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const lineTotal = (item.product.price * item.quantity) * (1 - discount / 100)
        return { ...item, discount, lineTotal }
      }
      return item
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const clearCart = () => {
    setCart([])
    setSelectedMember(null)
    setMemberSearch('')
  }

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0)
    const tax = subtotal * 0.1 // 10% tax
    const total = subtotal + tax
    
    return { subtotal, tax, total }
  }

  const processPayment = async (paymentMethod: 'cash' | 'card' | 'mobile') => {
    if (cart.length === 0) return

    setIsProcessing(true)
    try {
      const { subtotal, tax, total } = calculateTotals()
      const transactionNumber = `TXN${Date.now()}`
      const today = new Date().toISOString().split('T')[0]

      // Create transaction
      const transaction = await blink.db.transactions.create({
        id: `txn_${Date.now()}`,
        transaction_number: transactionNumber,
        cashier_id: user!.id,
        member_id: selectedMember?.id || null,
        subtotal: subtotal,
        tax_amount: tax,
        discount_amount: 0,
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: 'completed',
        shift_date: today
      })

      // Create transaction items
      for (const item of cart) {
        await blink.db.transaction_items.create({
          id: `item_${Date.now()}_${item.product.id}`,
          transaction_id: transaction.id,
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.price,
          discount_percent: item.discount,
          line_total: item.lineTotal
        })

        // Update product stock
        const newStock = item.product.stock_quantity - item.quantity
        await blink.db.products.update(item.product.id, {
          stock_quantity: Math.max(0, newStock)
        })
      }

      // Clear cart and show success
      clearCart()
      alert(`Transaction ${transactionNumber} completed successfully!`)
      
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Error processing payment. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredProducts = products.filter(product => 
    productFilter === 'all' || product.category === productFilter
  )

  const categories = ['all', ...new Set(products.map(p => p.category))]
  const { subtotal, tax, total } = calculateTotals()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Products Grid */}
      <div className="lg:col-span-2 space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={productFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setProductFilter(category)}
              className={productFilter === category ? "bg-purple-600" : ""}
            >
              {category.replace('_', ' ').toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {filteredProducts.map(product => (
            <Card 
              key={product.id}
              className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => addToCart(product)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-medium text-white text-sm mb-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-purple-400 mb-2">
                    ${product.price.toFixed(2)}
                  </p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      product.stock_quantity <= 10 ? 'bg-red-600' : 'bg-green-600'
                    }`}
                  >
                    Stock: {product.stock_quantity}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart and Checkout */}
      <div className="space-y-4">
        {/* Member Search */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-sm">Member (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search member..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            {selectedMember && (
              <div className="flex items-center justify-between p-2 bg-purple-600/20 rounded">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-400" />
                  <span className="text-white text-sm">{selectedMember.full_name}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedMember(null)
                    setMemberSearch('')
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            {searchResults.length > 0 && !selectedMember && (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {searchResults.map(member => (
                  <div
                    key={member.id}
                    className="p-2 hover:bg-gray-700 rounded cursor-pointer"
                    onClick={() => {
                      setSelectedMember(member)
                      setMemberSearch('')
                      setSearchResults([])
                    }}
                  >
                    <p className="text-white text-sm">{member.full_name}</p>
                    <p className="text-gray-400 text-xs">#{member.member_number}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cart */}
        <Card className="bg-gray-800 border-gray-700 flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm flex items-center">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart ({cart.length})
              </CardTitle>
              {cart.length > 0 && (
                <Button size="sm" variant="ghost" onClick={clearCart}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Cart is empty</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="p-3 bg-gray-700 rounded">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white text-sm font-medium">
                        {item.product.name}
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-white w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-purple-400 font-bold">
                        ${item.lineTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Discount %"
                        value={item.discount}
                        onChange={(e) => updateDiscount(item.product.id, parseFloat(e.target.value) || 0)}
                        className="h-8 text-xs bg-gray-600 border-gray-500"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <Separator className="bg-gray-600" />
                
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal:</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (10%):</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total:</span>
                    <span className="text-purple-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="bg-gray-600" />

                {/* Payment Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => processPayment('cash')}
                    disabled={isProcessing}
                  >
                    <Banknote className="mr-2 h-4 w-4" />
                    Cash Payment
                  </Button>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => processPayment('card')}
                    disabled={isProcessing}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Card Payment
                  </Button>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => processPayment('mobile')}
                    disabled={isProcessing}
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile Payment
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}