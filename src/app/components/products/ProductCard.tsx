'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart/cart-context'
import { Product } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { 
	Plus, 
	Minus, 
	ShoppingCart, 
	Package, 
	Check
} from 'lucide-react'

interface ProductCardProps {
	product: Product
	className?: string
}

export function ProductCard({ product, className = '' }: ProductCardProps) {
	const { addProduct, getProductQuantity, updateProductQuantity } = useCart()
	const [isAdding, setIsAdding] = useState(false)
	const [imageError, setImageError] = useState(false)
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
		if (currentQuantity >= 1) {
			updateProductQuantity(product.id, currentQuantity - 1)
		}
	}

	// Obtener la imagen del producto con fallback
	const getProductImage = () => {
		if (product.imageUrl && !imageError) {
			// Si la imagen no empieza con /, asumimos que está en /products/
			const imagePath = product.imageUrl.startsWith('/') 
				? product.imageUrl 
				: `/products/${product.imageUrl}`
			return imagePath
		}
		return '/placeholder-poster.jpg'
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={{ scale: 1.01 }}
			transition={{ duration: 0.3 }}
			className={`relative bg-black border border-soft-gray/10 rounded-2xl overflow-hidden group ${
				isOutOfStock ? 'opacity-75' : ''
			} ${className}`}
		>
			{/* Main container with horizontal layout */}
			<div className="flex flex-col sm:flex-row h-auto sm:h-[220px] relative">
				{/* Content Section - Left Side */}
				<div className="flex-1 p-6 flex flex-col justify-between z-10 min-h-[200px] sm:min-h-0">
					{/* Header with title */}
					<div>
						<h3 className="text-soft-beige font-semibold text-xl leading-tight group-hover:text-soft-gold transition-colors duration-300">
							{product.name}
						</h3>
					</div>

					{/* Price and Actions */}
					<div className="space-y-3">
						{/* Price */}
						<div className="flex items-center">
							<span className="text-3xl font-bold text-soft-gold">
								${product.price.toFixed(2)}
							</span>
						</div>

						{/* Cart Actions - Fixed height container to prevent layout shifts */}
						<div className="min-h-[42px] flex items-center">
							{currentQuantity === 0 ? (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.2 }}
									className="w-full"
								>
									<Button
										onClick={handleAddToCart}
										disabled={isOutOfStock || isAdding}
										className={`w-full py-2.5 font-medium transition-all duration-300 rounded-lg ${
											isOutOfStock
												? 'bg-soft-gray/20 text-soft-gray cursor-not-allowed'
												: isAdding
													? 'bg-soft-gold/80 text-deep-night'
													: 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night hover:shadow-md hover:shadow-soft-gold/10'
										}`}
									>
										{isAdding ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
												className="flex items-center gap-2"
											>
												<ShoppingCart className="w-4 h-4" />
												<span>Agregando...</span>
											</motion.div>
										) : isOutOfStock ? (
											<>
												<Package className="w-4 h-4 mr-2" />
												Producto Agotado
											</>
										) : (
											<>
												<ShoppingCart className="w-4 h-4 mr-2" />
												Agregar al Carrito
											</>
										)}
									</Button>
								</motion.div>
							) : (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.95 }}
									transition={{ duration: 0.2 }}
									className="w-full flex items-center justify-between gap-3"
								>
									<div className="flex items-center bg-soft-gray/10 rounded-lg overflow-hidden">
										<Button
											onClick={decrementQuantity}
											className="w-8 h-8 p-0 bg-transparent hover:bg-soft-gray/20 text-soft-beige border-none rounded-none transition-colors duration-200"
										>
											<Minus className="w-3 h-3" />
										</Button>
										
										<div className="px-3 min-w-[60px] text-center">
											<motion.span 
												key={currentQuantity}
												initial={{ scale: 1.2 }}
												animate={{ scale: 1 }}
												className="text-soft-beige font-medium text-sm block"
											>
												{currentQuantity}
											</motion.span>
											<span className="text-soft-beige/40 text-xs">
												en carrito
											</span>
										</div>
										
										<Button
											onClick={incrementQuantity}
											disabled={currentQuantity >= product.stock}
											className="w-8 h-8 p-0 bg-transparent hover:bg-soft-gray/20 text-soft-beige border-none disabled:opacity-50 rounded-none transition-colors duration-200"
										>
											<Plus className="w-3 h-3" />
										</Button>
									</div>

									{/* Subtotal */}
									<div className="flex flex-col items-end text-right">
										<span className="text-soft-beige/40 text-xs">Total:</span>
										<motion.span 
											key={product.price * currentQuantity}
											initial={{ scale: 1.1 }}
											animate={{ scale: 1 }}
											className="text-soft-gold font-semibold text-sm"
										>
											${(product.price * currentQuantity).toFixed(2)}
										</motion.span>
									</div>
								</motion.div>
							)}
						</div>
					</div>
				</div>

				{/* Image Section - Right Side */}
				<div className="relative w-full sm:w-[220px] h-[220px] sm:h-[220px] flex-shrink-0 order-first sm:order-last">
					{/* Gradient overlay from left for smooth transition */}
					<div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10 w-3/4 hidden sm:block" />
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10 sm:hidden" />
					
					{/* Product Image */}
					<div className="relative w-full h-full">
						<Image
							src={getProductImage()}
							alt={product.name}
							fill
							className="object-cover"
							onError={() => setImageError(true)}
							sizes="(max-width: 640px) 100vw, 220px"
							priority={false}
						/>
					</div>

					{/* Quick add indicator when item in cart */}
					{currentQuantity > 0 && (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							className="absolute top-2 right-2 bg-soft-gold text-deep-night rounded-full p-1.5 shadow-md z-20"
						>
							<Check className="w-3 h-3" />
						</motion.div>
					)}
				</div>
			</div>
		</motion.div>
	)
} 
