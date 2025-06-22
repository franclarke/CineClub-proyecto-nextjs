'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart/cart-context'
import { Product } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { 
	Plus, 
	Minus, 
	ShoppingCart, 
	Package, 
	Check,
	Star,
	Coffee,
	Cookie
} from 'lucide-react'

interface ProductCardProps {
	product: Product
	className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
	const { addProduct, getProductQuantity, updateProductQuantity, state } = useCart()
	const [isAdding, setIsAdding] = useState(false)
	const currentQuantity = getProductQuantity(product.id)
	const isOutOfStock = product.stock === 0

	const handleAddToCart = async () => {
		if (isOutOfStock) return

		setIsAdding(true)
		
		try {
			addProduct(product, 1)
			
			// Feedback visual breve
			setTimeout(() => {
				setIsAdding(false)
			}, 800)
		} catch (error) {
			console.error('Error adding product to cart:', error)
			setIsAdding(false)
		}
	}

	const incrementQuantity = () => {
		updateProductQuantity(product.id, currentQuantity + 1)
	}

	const decrementQuantity = () => {
		if (currentQuantity > 1) {
			updateProductQuantity(product.id, currentQuantity - 1)
		}
	}

	const getCategoryIcon = () => {
		const name = product.name.toLowerCase()
		if (name.includes('bebida') || name.includes('drink') || name.includes('agua') || name.includes('refresco')) {
			return <Coffee className="w-4 h-4" />
		} else if (name.includes('snack') || name.includes('palomitas') || name.includes('chocolate') || name.includes('dulce')) {
			return <Cookie className="w-4 h-4" />
		}
		return <Package className="w-4 h-4" />
	}

	const getStockBadgeColor = () => {
		if (product.stock === 0) return 'bg-red-500/20 text-red-400 border-red-500/30'
		if (product.stock <= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
		return 'bg-green-500/20 text-green-400 border-green-500/30'
	}

	const getStockText = () => {
		if (product.stock === 0) return 'Agotado'
		if (product.stock <= 5) return `Solo ${product.stock} disponibles`
		return `${product.stock} disponibles`
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-soft-gray/10 backdrop-blur-sm border border-soft-gray/20 rounded-2xl overflow-hidden hover:bg-soft-gray/20 transition-all duration-300 group flex flex-col h-full ${
				isOutOfStock ? 'opacity-60' : ''
			} ${className}`}
		>
			{/* Product Header */}
			<div className="p-6 pb-4 flex-1 flex flex-col">
				<div className="flex items-start justify-between mb-4">
					<div className="flex items-center gap-3 flex-1">
						<div className="w-10 h-10 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
							{getCategoryIcon()}
						</div>
						<div className="flex-1 min-w-0">
							<h3 className="text-soft-beige font-semibold text-lg leading-tight">
								{product.name}
							</h3>
							{product.description && (
								<p className="text-soft-beige/60 text-sm mt-1 line-clamp-2">
									{product.description}
								</p>
							)}
						</div>
					</div>
					
					{/* Stock badge */}
					<div className={`px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getStockBadgeColor()}`}>
						{getStockText()}
					</div>
				</div>

				{/* Spacer to push price down */}
				<div className="flex-1"></div>

				{/* Price and rating */}
				<div className="flex items-center justify-between mt-4">
					<div className="flex items-center gap-2">
						<span className="text-2xl font-bold text-soft-gold">
							${product.price.toFixed(2)}
						</span>
					</div>
					
					{/* Mock rating - puedes integrar ratings reales */}
					<div className="flex items-center gap-1">
						{[...Array(5)].map((_, i) => (
							<Star 
								key={i} 
								className={`w-3 h-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-soft-gray'}`} 
							/>
						))}
						<span className="text-soft-beige/60 text-xs ml-1">(4.0)</span>
					</div>
				</div>
			</div>

			{/* Actions - Always at bottom */}
			<div className="px-6 pb-6 mt-auto">
				{currentQuantity === 0 ? (
					<Button
						onClick={handleAddToCart}
						disabled={isOutOfStock || isAdding}
						className={`w-full py-3 font-semibold transition-all duration-300 ${
							isOutOfStock
								? 'bg-soft-gray/20 text-soft-gray cursor-not-allowed'
								: isAdding
									? 'bg-soft-gold/80 text-deep-night'
									: 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night hover:shadow-lg hover:scale-[1.02]'
						}`}
					>
						{isAdding ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
								className="flex items-center gap-2"
							>
								<ShoppingCart className="w-5 h-5" />
								<span>Agregando...</span>
							</motion.div>
						) : isOutOfStock ? (
							<>
								<Package className="w-5 h-5 mr-2" />
								Producto Agotado
							</>
						) : (
							<>
								<ShoppingCart className="w-5 h-5 mr-2" />
								Agregar al Carrito
							</>
						)}
					</Button>
				) : (
					<div className="space-y-3">
						{/* Quantity controls */}
						<div className="flex items-center justify-between bg-soft-gray/20 rounded-xl p-3">
							<Button
								onClick={decrementQuantity}
								className="w-8 h-8 p-0 bg-soft-gray/30 hover:bg-soft-gray/40 text-soft-beige border-none"
							>
								<Minus className="w-4 h-4" />
							</Button>
							
							<div className="flex items-center gap-2">
								<span className="text-soft-beige font-semibold">
									{currentQuantity}
								</span>
								<span className="text-soft-beige/60 text-sm">
									en carrito
								</span>
							</div>
							
							<Button
								onClick={incrementQuantity}
								disabled={currentQuantity >= product.stock}
								className="w-8 h-8 p-0 bg-soft-gray/30 hover:bg-soft-gray/40 text-soft-beige border-none disabled:opacity-50"
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>

						{/* Total for this product */}
						<div className="flex items-center justify-between text-sm">
							<span className="text-soft-beige/80">
								Subtotal:
							</span>
							<span className="text-soft-gold font-semibold">
								${(product.price * currentQuantity).toFixed(2)}
							</span>
						</div>

						{/* Added to cart confirmation */}
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							className="flex items-center justify-center gap-2 text-soft-gold text-sm"
						>
							<Check className="w-4 h-4" />
							<span>Agregado al carrito</span>
						</motion.div>
					</div>
				)}
			</div>

			{/* Hover effect overlay */}
			<div className="absolute inset-0 bg-gradient-to-t from-soft-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" />
		</motion.div>
	)
} 
