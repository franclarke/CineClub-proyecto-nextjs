'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { Search, Plus, Minus, ShoppingCart, Package, Coffee } from 'lucide-react'

interface ProductCartProps {
	products: Product[]
	cartItems: Record<string, number>
	onUpdateCart: (productId: string, quantity: number) => void
}

export function ProductCart({ products, cartItems, onUpdateCart }: ProductCartProps) {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	)

	const groupedProducts = filteredProducts.reduce((acc, product) => {
		// Simple categorization based on product name
		let category = 'Otros'
		if (product.name.toLowerCase().includes('bebida') || product.name.toLowerCase().includes('drink') || product.name.toLowerCase().includes('agua') || product.name.toLowerCase().includes('refresco')) {
			category = 'Bebidas'
		} else if (product.name.toLowerCase().includes('snack') || product.name.toLowerCase().includes('palomitas') || product.name.toLowerCase().includes('chocolate') || product.name.toLowerCase().includes('dulce')) {
			category = 'Snacks'
		}

		if (!acc[category]) {
			acc[category] = []
		}
		acc[category].push(product)
		return acc
	}, {} as Record<string, Product[]>)

	const updateQuantity = (productId: string, change: number) => {
		const currentQuantity = cartItems[productId] || 0
		const newQuantity = Math.max(0, currentQuantity + change)
		const product = products.find(p => p.id === productId)
		
		if (product && newQuantity <= product.stock) {
			onUpdateCart(productId, newQuantity)
		}
	}

	const totalItems = Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
						<ShoppingCart className="w-5 h-5 text-soft-gold" />
					</div>
					<h3 className="text-lg font-bold text-soft-beige">
						Tienda Food & Drinks
					</h3>
				</div>
				{totalItems > 0 && (
					<div className="bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 px-3 py-1.5 rounded-full text-sm font-medium">
						{totalItems} productos
					</div>
				)}
			</div>

			{/* Search */}
			<div className="relative">
				<Search className="w-4 h-4 text-soft-beige/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
				<input
					type="text"
					placeholder="Buscar productos..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2.5 bg-soft-gray/10 border border-soft-gray/20 rounded-xl text-soft-beige placeholder-soft-beige/50 focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20 transition-all duration-200 text-sm"
				/>
			</div>

			{/* Products by category */}
			<div className="space-y-6">
				{Object.entries(groupedProducts).map(([category, categoryProducts]) => (
					<div key={category}>
						<h4 className="text-soft-beige font-medium mb-3 flex items-center gap-2">
							<Coffee className="w-4 h-4 text-soft-gold" />
							{category}
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{categoryProducts.map((product) => {
								const quantity = cartItems[product.id] || 0
								const isOutOfStock = product.stock === 0
								const isMaxQuantity = quantity >= product.stock

								return (
									<div
										key={product.id}
										className={`p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20 transition-all duration-200 ${
											isOutOfStock ? 'opacity-50' : 'hover:bg-soft-gray/20'
										}`}
									>
										<div className="flex justify-between items-start mb-3">
											<div className="flex-1">
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
														<Package className="w-4 h-4 text-soft-gold" />
													</div>
													<div className="flex-1">
														<h5 className="text-soft-beige font-medium mb-1">
															{product.name}
														</h5>
														{product.description && (
															<p className="text-soft-beige/60 text-sm mb-2">
																{product.description}
															</p>
														)}
														<div className="flex items-center gap-2">
															<span className="text-sunset-orange font-bold">
																${product.price}
															</span>
															<span className="text-soft-beige/60 text-xs">
																Stock: {product.stock}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Quantity controls */}
										<div className="flex items-center justify-between pt-3 border-t border-soft-gray/20">
											<div className="flex items-center gap-2">
												<button
													onClick={() => updateQuantity(product.id, -1)}
													disabled={quantity === 0 || isOutOfStock}
													className="w-8 h-8 bg-soft-gray/20 border border-soft-gray/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-soft-gray/30 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<Minus className="w-3 h-3 text-soft-beige" />
												</button>
												
												<span className="w-8 text-center text-soft-beige font-medium">
													{quantity}
												</span>
												
												<button
													onClick={() => updateQuantity(product.id, 1)}
													disabled={isOutOfStock || isMaxQuantity}
													className="w-8 h-8 bg-soft-gray/20 border border-soft-gray/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:bg-soft-gray/30 disabled:opacity-50 disabled:cursor-not-allowed"
												>
													<Plus className="w-3 h-3 text-soft-beige" />
												</button>
											</div>

											{quantity > 0 && (
												<div className="text-soft-beige font-bold">
													${(product.price * quantity).toFixed(2)}
												</div>
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

			{filteredProducts.length === 0 && (
				<div className="text-center py-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<Search className="w-8 h-8 text-soft-gray" />
					</div>
					<p className="text-soft-beige/60">
						{searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
					</p>
				</div>
			)}
		</div>
	)
} 