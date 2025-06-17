'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'

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
		<GlassCard className="p-6">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-display text-xl text-soft-beige">
					Tienda Food & Drinks
				</h3>
				{totalItems > 0 && (
					<div className="bg-sunset-orange text-deep-night px-3 py-1 rounded-full text-sm font-medium">
						{totalItems} productos
					</div>
				)}
			</div>

			{/* Search */}
			<div className="mb-6">
				<div className="relative">
					<svg className="w-5 h-5 text-soft-gray absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<input
						type="text"
						placeholder="Buscar productos..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 bg-soft-gray/20 border border-soft-gray/30 rounded-lg text-soft-beige placeholder-soft-gray focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent"
					/>
				</div>
			</div>

			{/* Products by category */}
			<div className="space-y-6">
				{Object.entries(groupedProducts).map(([category, categoryProducts]) => (
					<div key={category}>
						<h4 className="text-soft-beige font-medium mb-3 border-b border-soft-gray/20 pb-2">
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
										className={`p-4 bg-soft-gray/10 rounded-lg border border-soft-gray/20 transition-all duration-200 ${
											isOutOfStock ? 'opacity-50' : 'hover:bg-soft-gray/20'
										}`}
									>
										<div className="flex justify-between items-start mb-3">
											<div className="flex-1">
												<h5 className="text-soft-beige font-medium mb-1">
													{product.name}
												</h5>
												{product.description && (
													<p className="text-soft-gray text-sm mb-2">
														{product.description}
													</p>
												)}
												<div className="flex items-center gap-2">
													<span className="text-sunset-orange font-bold">
														${product.price}
													</span>
													<span className="text-soft-gray text-xs">
														Stock: {product.stock}
													</span>
												</div>
											</div>
										</div>

										{/* Quantity controls */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => updateQuantity(product.id, -1)}
													disabled={quantity === 0 || isOutOfStock}
													className="w-8 h-8 p-0"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
													</svg>
												</Button>
												
												<span className="w-8 text-center text-soft-beige font-medium">
													{quantity}
												</span>
												
												<Button
													size="sm"
													variant="outline"
													onClick={() => updateQuantity(product.id, 1)}
													disabled={isOutOfStock || isMaxQuantity}
													className="w-8 h-8 p-0"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
													</svg>
												</Button>
											</div>

											{quantity > 0 && (
												<div className="text-soft-beige font-medium">
													${(product.price * quantity).toFixed(2)}
												</div>
											)}
										</div>

										{isOutOfStock && (
											<div className="mt-2 text-warm-red text-xs font-medium">
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
					<div className="w-16 h-16 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<p className="text-soft-gray">
						{searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
					</p>
				</div>
			)}
		</GlassCard>
	)
} 