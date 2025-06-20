'use client'

import { useState } from 'react'
import { Product } from '@prisma/client'
import { CartItem } from '@/types/api'
import { Search, ShoppingCart, Package, Coffee } from 'lucide-react'

interface ProductCartProps {
	items: CartItem[]
	availableProducts: Product[]
}

export function ProductCart({ items, availableProducts }: ProductCartProps) {
	const [searchTerm, setSearchTerm] = useState('')

	const filteredProducts = availableProducts.filter(product =>
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

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
	const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
						<ShoppingCart className="w-5 h-5 text-soft-gold" />
					</div>
					<h3 className="text-lg font-bold text-soft-beige">
						Productos Seleccionados
					</h3>
				</div>
				{totalItems > 0 && (
					<div className="bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 px-3 py-1.5 rounded-full text-sm font-medium">
						{totalItems} productos
					</div>
				)}
			</div>

			{/* Cart Items */}
			{items.length > 0 && (
				<div className="space-y-4">
					<h4 className="text-soft-beige font-medium">En tu carrito:</h4>
					{items.map((item) => (
						<div
							key={item.id}
							className="p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
										<Package className="w-4 h-4 text-soft-gold" />
									</div>
									<div>
										<h5 className="text-soft-beige font-medium">
											{item.product.name}
										</h5>
										<p className="text-soft-beige/60 text-sm">
											{item.quantity} × ${item.price.toFixed(2)}
										</p>
									</div>
								</div>
								<div className="text-sunset-orange font-bold">
									${(item.price * item.quantity).toFixed(2)}
								</div>
							</div>
						</div>
					))}
					
					{/* Total */}
					<div className="p-4 bg-gradient-to-r from-sunset-orange/10 to-soft-gold/10 rounded-xl border border-sunset-orange/20">
						<div className="flex items-center justify-between">
							<span className="text-soft-beige font-medium">
								Total Productos:
							</span>
							<span className="text-sunset-orange font-bold text-lg">
								${totalAmount.toFixed(2)}
							</span>
						</div>
					</div>
				</div>
			)}

			{/* Available Products for adding more */}
			{availableProducts.length > 0 && (
				<div className="space-y-4">
					<h4 className="text-soft-beige font-medium">Agregar más productos:</h4>
					
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
								<h5 className="text-soft-beige/80 font-medium mb-3 flex items-center gap-2">
									<Coffee className="w-4 h-4 text-soft-gold" />
									{category}
								</h5>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{categoryProducts.map((product) => {
										const isOutOfStock = product.stock === 0

										return (
											<div
												key={product.id}
												className={`p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20 transition-all duration-200 ${
													isOutOfStock ? 'opacity-50' : 'hover:bg-soft-gray/20'
												}`}
											>
												<div className="flex justify-between items-start">
													<div className="flex-1">
														<div className="flex items-start gap-3">
															<div className="w-8 h-8 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center">
																<Package className="w-4 h-4 text-soft-gold" />
															</div>
															<div className="flex-1">
																<h6 className="text-soft-beige font-medium mb-1">
																	{product.name}
																</h6>
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

			{items.length === 0 && (
				<div className="text-center py-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<ShoppingCart className="w-8 h-8 text-soft-gray" />
					</div>
					<p className="text-soft-beige/60">
						No tienes productos en tu carrito
					</p>
				</div>
			)}
		</div>
	)
} 