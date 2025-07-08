'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart/cart-context'
import { ProductCartItem, SeatCartItem } from '@/types/cart'
import {
	X,
	Trash2,
	Plus,
	Minus,
	Package,
	Ticket,
	Calendar,
	MapPin,
	Clock,
	AlertTriangle,
	ArrowRight,
	Sparkles,
	ShoppingBag,
	CreditCard
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatShortDate } from '@/lib/utils/date'
import { useHydration } from '@/app/hooks/use-hydration'

export function GlobalCartSidebar() {
	const { state, toggleCart, getExpiredSeats } = useCart()
	const router = useRouter()
	const expiredSeats = getExpiredSeats()

	const handleCheckout = () => {
		if (state.items.length > 0) {
			toggleCart()
			router.push('/checkout')
		}
	}

	const handleContinueShopping = () => {
		toggleCart()
		router.push('/events')
	}

	const handleViewCart = () => {
		toggleCart()
		router.push('/shop')
	}

	return (
		<AnimatePresence>
			{state.isOpen && (
				<>
					{/* Overlay */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 bg-black/60  backdrop-blur-sm z-50"
						onClick={toggleCart}
					/>

					{/* Sidebar */}
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: '0%' }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 300 }}
						className="fixed right-0 top-0 h-full w-full max-w-lg bg-deep-night/98 backdrop-blur-2xl border-l border-soft-gray/30 z-50 flex flex-col shadow-2xl"
					>
						{/* Header */}
						<div className="p-6 border-b border-soft-gray/20 bg-gradient-to-r from-deep-night/50 to-deep-night/80">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-gradient-to-r  from-sunset-orange/30 to-soft-gold/30 rounded-2xl flex items-center justify-center ring-2 ring-soft-gold/20">
										<ShoppingBag className="w-6 h-6 text-soft-gold" />
									</div>
									<div>
										<h2 className="text-2xl font-bold text-soft-beige">Carrito</h2>
										<p className="text-soft-beige/60 text-sm">
											{state.totalItems} {state.totalItems === 1 ? 'artículo' : 'artículos'}
										</p>
									</div>
								</div>
								<Button
									onClick={toggleCart}
									className="w-10 h-10 p-0 bg-soft-gray/20 hover:bg-soft-gray/40 text-soft-beige border-none rounded-xl transition-all duration-200"
								>
									<X className="w-5 h-5" />
								</Button>
							</div>

							{/* Expired seats warning */}
							{expiredSeats.length > 0 && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl"
								>
									<div className="flex items-center gap-3">
										<AlertTriangle className="w-5 h-5 text-red-400" />
										<div>
											<span className="text-red-300 text-sm font-medium block">
												{expiredSeats.length} reserva{expiredSeats.length > 1 ? 's' : ''} expirada{expiredSeats.length > 1 ? 's' : ''}
											</span>
											<span className="text-red-400/80 text-xs">
												Estas reservas han sido eliminadas automáticamente
											</span>
										</div>
									</div>
								</motion.div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 overflow-y-auto custom-scrollbar">
							{state.items.length === 0 ? (
								<EmptyCart onContinueShopping={handleContinueShopping} />
							) : (
								<CartItemsList />
							)}
						</div>

						{/* Footer */}
						{state.items.length > 0 && (
							<div className="p-6 border-t border-soft-gray/20 bg-gradient-to-t from-deep-night/90 to-deep-night/50 space-y-6">
								{/* Totals */}
								<div className="space-y-3">
									<div className="flex justify-between text-soft-beige/80">
										<span>Subtotal</span>
										<span className="font-medium">${state.subtotal.toFixed(2)}</span>
									</div>
									{state.discount > 0 && (
										<div className="flex justify-between text-soft-gold">
											<span className="text-sm">Descuento membresía</span>
											<span className="font-medium">-${state.discount.toFixed(2)}</span>
										</div>
									)}
									<div className="h-px bg-gradient-to-r from-transparent via-soft-gray/30 to-transparent"></div>
									<div className="flex justify-between text-soft-beige font-bold text-xl">
										<span>Total</span>
										<span className="text-sunset-orange">${state.total.toFixed(2)}</span>
									</div>
								</div>

								{/* Actions */}
								<div className="space-y-3">
									<Button
										onClick={handleCheckout}
										className="w-full bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold py-4 text-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-2xl"
									>
										<CreditCard className="w-5 h-5 mr-3" />
										Finalizar Compra
										<ArrowRight className="w-5 h-5 ml-3" />
									</Button>

									<div className="grid grid-cols-2 gap-3">
										<Button
											onClick={handleViewCart}
											className="bg-soft-gray/20 border border-soft-gray/30 text-soft-beige hover:bg-soft-gray/30 py-3 rounded-xl transition-all duration-200"
										>
											<ShoppingBag className="w-4 h-4 mr-2 " />
											Ir a Tienda
										</Button>
										<Button
											onClick={handleContinueShopping}
											className="bg-transparent border border-soft-gold/30 text-soft-gold hover:bg-soft-gold/10 py-3 rounded-xl transition-all duration-200"
										>
											<Sparkles className="w-4 h-4 mr-2" />
											Explorar
										</Button>
									</div>
								</div>

								{/* Security badge */}
								<div className="flex items-center justify-center gap-2 text-soft-beige/50 text-xs">
									<div className="w-3 h-3 bg-green-500 rounded-full"></div>
									<span>Pago 100% seguro con MercadoPago</span>
								</div>
							</div>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	)
}

// Componente para carrito vacío
function EmptyCart({ onContinueShopping }: { onContinueShopping: () => void }) {
	return (
		<div className="flex flex-col items-center justify-center h-full px-8 text-center">
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.2 }}
				className="w-24 h-24 bg-gradient-to-br from-soft-gray/20 to-soft-gray/10 rounded-3xl flex items-center justify-center mb-8 ring-1 ring-soft-gray/20"
			>
				<ShoppingBag className="w-12 h-12 text-soft-gray " />
			</motion.div>
			<h3 className="text-2xl font-bold text-soft-beige mb-4">
				Tu carrito está vacío
			</h3>
			<p className="text-soft-beige/60 mb-10 leading-relaxed max-w-sm">
				Descubre nuestros productos exclusivos y vive una experiencia cinematográfica única
			</p>
			<Button
				onClick={onContinueShopping}
				className="bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold px-8 py-4 hover:shadow-xl hover:scale-[1.05] transition-all duration-300 rounded-2xl"
			>
				<Sparkles className="w-5 h-5 mr-3" />
				Explorar Eventos
			</Button>
		</div>
	)
}

// Lista de items del carrito
function CartItemsList() {
	const { state } = useCart()

	// Separar productos y seats
	const products = state.items.filter(item => item.type === 'product') as ProductCartItem[]
	const seats = state.items.filter(item => item.type === 'seat') as SeatCartItem[]

	return (
		<div className="p-6 space-y-6">
			{/* Seats Section */}
			{seats.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center gap-3 pb-2">
						<Ticket className="w-5 h-5 text-soft-gold" />
						<h3 className="font-bold text-soft-beige text-lg">Reservas de Asientos</h3>
					</div>
					{seats.map(seat => (
						<SeatCartItemComponent key={seat.id} item={seat} />
					))}
				</div>
			)}

			{/* Products Section */}
			{products.length > 0 && (
				<div className="space-y-4">
					<div className="flex items-center gap-3 pb-2">
						<Package className="w-5 h-5 text-soft-gold" />
						<h3 className="font-bold text-soft-beige text-lg">Productos</h3>
					</div>
					{products.map(product => (
						<ProductCartItemComponent key={product.id} item={product} />
					))}
				</div>
			)}
		</div>
	)
}

// Componente para seat item
function SeatCartItemComponent({ item }: { item: SeatCartItem }) {
	const { removeItem } = useCart()
	const isHydrated = useHydration()
	const isExpired = item.expiresAt && isHydrated ? new Date() > item.expiresAt : false

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`p-4 rounded-2xl border transition-all duration-200 ${isExpired
				? 'bg-red-500/10 border-red-500/30'
				: 'bg-soft-gray/10 border-soft-gray/20 hover:bg-soft-gray/20'
				}`}
		>
			<div className="flex justify-between items-start">
				<div className="flex-1">
					<h4 className="text-soft-beige font-medium mb-1">
						{item.event.title}
					</h4>
					<div className="space-y-1 text-sm text-soft-beige/60">
						<div className="flex items-center gap-2">
							<MapPin className="w-3 h-3" />
							<span className="text-xs text-soft-beige/70 leading-tight">
								{item.seat.tier} - Asiento {item.seat.seatNumber}
							</span>
						</div>
						<div className="flex items-center gap-2">
							<Calendar className="w-3 h-3" />
							<span className="text-xs text-soft-beige/50">
								<span>{formatShortDate(item.event.dateTime)}</span>
								{' • '}
								<span>{item.event.location}</span>
							</span>
						</div>
						{item.expiresAt && isHydrated && (
							<div className="flex items-center gap-2">
								<Clock className="w-3 h-3" />
								<span
									className={isExpired ? 'text-red-400' : 'text-yellow-400'}
									suppressHydrationWarning
								>
									{isExpired
										? 'Expirado'
										: `Expira ${formatDistanceToNow(item.expiresAt, { locale: es, addSuffix: true })}`
									}
								</span>
							</div>
						)}
					</div>
				</div>

				<div className="text-right ml-4">
					<div className="text-soft-beige font-bold text-lg mb-2">
						${item.totalPrice.toFixed(2)}
					</div>
					<Button
						onClick={() => removeItem(item.id)}
						className="w-8 h-8 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-none rounded-lg"
					>
						<Trash2 className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</motion.div>
	)
}

// Componente para product item
function ProductCartItemComponent({ item }: { item: ProductCartItem }) {
	const { removeItem, updateProductQuantity } = useCart()

	const incrementQuantity = () => {
		updateProductQuantity(item.product.id, item.quantity + 1)
	}

	const decrementQuantity = () => {
		if (item.quantity > 1) {
			updateProductQuantity(item.product.id, item.quantity - 1)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-4 bg-soft-gray/10 border border-soft-gray/20 rounded-2xl hover:bg-soft-gray/20 transition-all duration-200"
		>
			<div className="flex items-center gap-4">
				<div className="w-14 h-14 bg-gradient-to-br from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center ring-1 ring-soft-gold/20">
					<Package className="w-7 h-7 text-soft-gold" />
				</div>

				<div className="flex-1">
					<h4 className="text-soft-beige font-medium mb-1">
						{item.product.name}
					</h4>
					{item.product.description && (
						<p className="text-soft-beige/60 text-sm mb-2">
							{item.product.description}
						</p>
					)}
					<div className="text-soft-beige/80 text-sm">
						${item.unitPrice.toFixed(2)} c/u
					</div>
				</div>

				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 bg-deep-night/50 rounded-xl p-1">
						<Button
							onClick={decrementQuantity}
							disabled={item.quantity <= 1}
							className="w-8 h-8 p-0 bg-soft-gray/20 hover:bg-soft-gray/40 text-soft-beige border-none rounded-lg"
						>
							<Minus className="w-4 h-4" />
						</Button>
						<span className="w-8 text-center text-soft-beige font-medium">
							{item.quantity}
						</span>
						<Button
							onClick={incrementQuantity}
							className="w-8 h-8 p-0 bg-soft-gray/20 hover:bg-soft-gray/40 text-soft-beige border-none rounded-lg"
						>
							<Plus className="w-4 h-4" />
						</Button>
					</div>

					<div className="text-right">
						<div className="text-soft-beige font-bold text-lg">
							${item.totalPrice.toFixed(2)}
						</div>
						<Button
							onClick={() => removeItem(item.id)}
							className="w-8 h-8 p-0 bg-red-500/20 hover:bg-red-500/30 text-red-400 border-none rounded-lg mt-2"
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	)
} 
