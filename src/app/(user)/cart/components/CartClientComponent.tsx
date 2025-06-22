'use client'

import { useState } from 'react'
import { User, Product, Order, OrderItem } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { 
	Plus, 
	Minus, 
	Trash2, 
	ShoppingCart, 
	ShoppingBag, 
	ArrowRight, 
	Package,
	Coffee,
	Sparkles,
	CheckCircle
} from 'lucide-react'

type UserWithMembership = User & {
	membership: {
		name: string
		discounts: number
	}
}

type OrderWithItems = Order & {
	items: (OrderItem & {
		product: Product
	})[]
}

interface CartClientComponentProps {
	user: UserWithMembership
	cartOrders: OrderWithItems[]
	availableProducts: Product[]
}

export function CartClientComponent({ 
	user, 
	cartOrders, 
	availableProducts 
}: CartClientComponentProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
	const [searchTerm, setSearchTerm] = useState('')

	// Obtener items del carrito
	const cartItems = cartOrders.flatMap(order => order.items)
	
	// Calcular totales
	const subtotal = cartItems.reduce((acc, item) => 
		acc + (item.product.price * item.quantity), 0
	)
	
	const discount = user.membership ? subtotal * (user.membership.discounts / 100) : 0
	const total = subtotal - discount

	// Filtrar productos disponibles
	const filteredProducts = availableProducts.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	// Categorizar productos
	const categorizedProducts = filteredProducts.reduce((acc, product) => {
		let category = 'Otros'
		const name = product.name.toLowerCase()
		
		if (name.includes('bebida') || name.includes('drink') || name.includes('agua') || name.includes('refresco')) {
			category = 'Bebidas'
		} else if (name.includes('snack') || name.includes('palomitas') || name.includes('chocolate') || name.includes('dulce')) {
			category = 'Snacks'
		} else if (name.includes('combo') || name.includes('pack')) {
			category = 'Combos'
		}

		if (!acc[category]) acc[category] = []
		acc[category].push(product)
		return acc
	}, {} as Record<string, Product[]>)

	const updateQuantity = async (productId: string, newQuantity: number) => {
		if (newQuantity < 1) return

		setLoadingItems(prev => new Set(prev).add(productId))
		
		try {
			const response = await fetch('/api/cart/update', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId, quantity: newQuantity })
			})

			if (response.ok) {
				router.refresh()
			}
		} catch (error) {
			console.error('Error updating cart:', error)
		} finally {
			setLoadingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(productId)
				return newSet
			})
		}
	}

	const addToCart = async (productId: string, quantity: number = 1) => {
		setIsLoading(true)
		
		try {
			const response = await fetch('/api/cart/add', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId, quantity })
			})

			if (response.ok) {
				router.refresh()
			}
		} catch (error) {
			console.error('Error adding to cart:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const removeItem = async (productId: string) => {
		setLoadingItems(prev => new Set(prev).add(productId))
		
		try {
			const response = await fetch('/api/cart/remove', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId })
			})

			if (response.ok) {
				router.refresh()
			}
		} catch (error) {
			console.error('Error removing item:', error)
		} finally {
			setLoadingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(productId)
				return newSet
			})
		}
	}

	const proceedToCheckout = () => {
		if (cartItems.length > 0) {
			router.push('/checkout')
		}
	}

	// Empty cart state
	if (cartItems.length === 0 && availableProducts.length === 0) {
		return (
			<div className="text-center py-20">
				<div className="max-w-md mx-auto">
					<div className="w-20 h-20 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<ShoppingCart className="w-10 h-10 text-soft-gray" />
					</div>
					<h3 className="text-2xl font-bold text-soft-beige mb-3">
						Tu carrito está vacío
					</h3>
					<p className="text-soft-beige/60 mb-8 leading-relaxed">
						Explora nuestros eventos y agrega productos desde la tienda
					</p>
					<button
						onClick={() => router.push('/events')}
						className="inline-flex items-center gap-3 bg-gradient-sunset-gold text-deep-night px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
					>
						<ShoppingBag className="w-5 h-5" />
						<span>Explorar Eventos</span>
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Cart Items Section */}
			{cartItems.length > 0 && (
				<div className="space-y-6">
					{/* Section Header */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-1 h-6 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full"></div>
							<h2 className="text-2xl font-bold text-soft-beige">
								Productos en tu Carrito
							</h2>
						</div>
						<div className="bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 px-3 py-1.5 rounded-full text-sm font-medium">
							{cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
						</div>
					</div>

					{/* Cart Items Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
						{cartItems.map((item, index) => {
							const isItemLoading = loadingItems.has(item.product.id)
							return (
								<div
									key={item.product.id}
									className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6 transition-all duration-300 hover:border-sunset-orange/30 group"
									style={{ animationDelay: `${index * 0.1}s` }}
								>
									{/* Product Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3 className="font-semibold text-soft-beige group-hover:text-sunset-orange transition-colors duration-300 mb-1">
												{item.product.name}
											</h3>
											<p className="text-soft-beige/60 text-sm">
												${item.product.price} por unidad
											</p>
										</div>
										<div className="w-10 h-10 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
											<Package className="w-5 h-5 text-soft-gold" />
										</div>
									</div>

									{/* Quantity Controls */}
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center space-x-3">
											<button
												onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
												disabled={isItemLoading || item.quantity <= 1}
												className="w-8 h-8 bg-soft-gray/20 hover:bg-soft-gray/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
											>
												<Minus className="w-4 h-4 text-soft-beige" />
											</button>
											
											<span className="text-soft-beige font-semibold min-w-8 text-center">
												{item.quantity}
											</span>
											
											<button
												onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
												disabled={isItemLoading}
												className="w-8 h-8 bg-soft-gray/20 hover:bg-soft-gray/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
											>
												<Plus className="w-4 h-4 text-soft-beige" />
											</button>
										</div>

										<button
											onClick={() => removeItem(item.product.id)}
											disabled={isItemLoading}
											className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200 group"
										>
											<Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
										</button>
									</div>

									{/* Subtotal */}
									<div className="pt-4 border-t border-soft-gray/20">
										<div className="flex justify-between items-center">
											<span className="text-soft-beige/60 text-sm">Subtotal</span>
											<span className="font-bold text-sunset-orange text-lg">
												${(item.product.price * item.quantity).toFixed(2)}
											</span>
										</div>
									</div>
								</div>
							)
						})}
					</div>

					{/* Checkout Summary Section */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-8">
						<div className="flex items-center space-x-3 mb-6">
							<div className="w-1 h-6 bg-gradient-to-b from-soft-gold to-sunset-orange rounded-full"></div>
							<h3 className="text-xl font-bold text-soft-beige">
								Resumen de Compra
							</h3>
						</div>

						<div className="space-y-3 mb-6">
							<div className="flex justify-between items-center">
								<span className="text-soft-beige/70">Subtotal</span>
								<span className="text-soft-beige font-medium">${subtotal.toFixed(2)}</span>
							</div>
							
							{user.membership && discount > 0 && (
								<div className="flex justify-between items-center text-soft-gold">
									<span>Descuento {user.membership.name} ({user.membership.discounts}%)</span>
									<span>-${discount.toFixed(2)}</span>
								</div>
							)}
							
							<div className="h-px bg-soft-gray/20 my-4"></div>
							
							<div className="flex justify-between items-center">
								<span className="text-xl font-bold text-soft-beige">Total</span>
								<span className="text-xl font-bold text-sunset-orange">${total.toFixed(2)}</span>
							</div>
						</div>

						<button
							onClick={proceedToCheckout}
							disabled={isLoading || cartItems.length === 0}
							className="w-full bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
						>
							{isLoading ? (
								<div className="w-5 h-5 border-2 border-deep-night/30 border-t-deep-night rounded-full animate-spin"></div>
							) : (
								<>
									<CheckCircle className="w-5 h-5" />
									<span>Proceder al Checkout</span>
									<ArrowRight className="w-5 h-5" />
								</>
							)}
						</button>
					</div>
				</div>
			)}

			{/* Available Products Section */}
			{availableProducts.length > 0 && (
				<div className="space-y-6">
					{/* Section Header with Search */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
						<div className="flex items-center space-x-3">
							<div className="w-1 h-6 bg-gradient-to-b from-soft-gold to-sunset-orange rounded-full"></div>
							<h2 className="text-2xl font-bold text-soft-beige">
								Productos Disponibles
							</h2>
						</div>
						
						{/* Search Bar */}
						<div className="relative w-full sm:w-80">
							<Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-soft-beige/40" />
							<input
								type="text"
								placeholder="Buscar productos..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-soft-gray/10 border border-soft-gray/20 text-soft-beige placeholder-soft-beige/50 focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20 transition-all duration-200 text-sm"
							/>
						</div>
					</div>

					{/* Products by Category */}
					<div className="space-y-8">
						{Object.entries(categorizedProducts).map(([category, products]) => (
							<div key={category} className="space-y-4">
								<div className="flex items-center space-x-3">
									<Coffee className="w-5 h-5 text-soft-gold" />
									<h3 className="text-lg font-semibold text-soft-beige">{category}</h3>
									<div className="flex-1 h-px bg-soft-gray/20"></div>
									<span className="text-soft-beige/60 text-sm">{products.length} productos</span>
								</div>
								
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{products.map((product) => {
										const cartItem = cartItems.find(item => item.product.id === product.id)
										const inCart = !!cartItem
										const isOutOfStock = product.stock === 0
										
										return (
											<div
												key={product.id}
												className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6 transition-all duration-300 hover:border-soft-gold/30 group"
											>
												<div className="flex items-start justify-between mb-4">
													<div className="flex-1">
														<h4 className="font-semibold text-soft-beige group-hover:text-soft-gold transition-colors duration-300 mb-1">
															{product.name}
														</h4>
														{product.description && (
															<p className="text-soft-beige/60 text-sm mb-2">
																{product.description}
															</p>
														)}
														<div className="flex justify-between items-center">
															<span className="text-sunset-orange font-bold">
																${product.price.toFixed(2)}
															</span>
															<span className="text-soft-beige/60 text-sm">
																Stock: {product.stock}
															</span>
														</div>
													</div>
													<div className="w-10 h-10 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center ml-4">
														<Package className="w-5 h-5 text-soft-gold" />
													</div>
												</div>

												<div className="pt-4 border-t border-soft-gray/20">
													{inCart ? (
														<div className="flex items-center justify-between">
															<span className="text-soft-gold text-sm font-medium">
																En carrito: {cartItem.quantity}
															</span>
															<button
																onClick={() => addToCart(product.id, 1)}
																disabled={isLoading || isOutOfStock}
																className="bg-soft-gold/20 text-soft-gold border border-soft-gold/30 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-soft-gold/30 disabled:opacity-50 disabled:cursor-not-allowed"
															>
																Agregar más
															</button>
														</div>
													) : (
														<button
															onClick={() => addToCart(product.id, 1)}
															disabled={isLoading || isOutOfStock}
															className="w-full bg-gradient-sunset-gold text-deep-night py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
														>
															{isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
														</button>
													)}
												</div>

												{isOutOfStock && (
													<div className="mt-2 text-red-400 text-xs font-medium">
														Agotado
													</div>
												)}
											</div>
										)
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
} 
