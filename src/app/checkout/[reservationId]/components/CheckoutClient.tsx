'use client'

import { useState, useEffect, useOptimistic, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Order, OrderItem, Product, User, MembershipTier } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'
import { CountdownTimer } from './CountdownTimer'
import { ReservationSummary } from './ReservationSummary'
import { ProductCart } from './ProductCart'
import { OrderSummary } from './OrderSummary'
import { ReservationsByEvent } from '@/types/api'

type OrderWithExtras = Order & {
	user: User & {
		membership: MembershipTier
	}
	items: (OrderItem & {
		product: Product
	})[]
	reservationsByEvent: ReservationsByEvent
}

interface CheckoutClientProps {
	order: OrderWithExtras
	products: Product[]
	expiresAt: Date
}

export function CheckoutClient({ order, products, expiresAt }: CheckoutClientProps) {
	const router = useRouter()
	const [isProcessing, setIsProcessing] = useState(false)
	const [cartItems, setCartItems] = useState<Record<string, number>>({})
	const [timeExpired, setTimeExpired] = useState(false)

	// Initialize cart items from order
	useEffect(() => {
		const initialCart = order.items.reduce((acc, item) => {
			acc[item.productId] = item.quantity
			return acc
		}, {} as Record<string, number>)
		setCartItems(initialCart)
	}, [order.items])

	// Optimistic state for cart updates
	const [optimisticCartItems, updateOptimisticCart] = useOptimistic(
		cartItems,
		(state, { productId, quantity }: { productId: string, quantity: number }) => ({
			...state,
			[productId]: quantity
		})
	)

	// Calculate totals
	const totals = useMemo(() => {
		const ticketTotal = Object.values(order.reservationsByEvent).reduce(
			(sum, { reservations }) => sum + (reservations.length * 25), 0
		)

		const productTotal = Object.entries(optimisticCartItems).reduce(
			(sum, [productId, quantity]) => {
				const product = products.find(p => p.id === productId)
				return sum + (product ? product.price * quantity : 0)
			}, 0
		)

		return {
			tickets: ticketTotal,
			products: productTotal,
			total: ticketTotal + productTotal
		}
	}, [order.reservationsByEvent, optimisticCartItems, products])

	const handleCartUpdate = async (productId: string, quantity: number) => {
		// Optimistic update
		updateOptimisticCart({ productId, quantity })
		
		// Update local state
		setCartItems(prev => ({
			...prev,
			[productId]: quantity
		}))

		// Here you could add API call to update order items
		// For now, we'll handle it during final checkout
	}

	const handleCheckout = async () => {
		if (timeExpired) {
			alert('Tu reserva ha expirado. Por favor, intenta de nuevo.')
			router.push('/events')
			return
		}

		setIsProcessing(true)

		try {
			// Create Mercado Pago preference
			const response = await fetch('/api/payments/create-preference', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					orderId: order.id,
					cartItems: optimisticCartItems,
					totals
				})
			})

			if (!response.ok) {
				throw new Error('Error creating payment preference')
			}

			const { initPoint } = await response.json()
			
			// Redirect to Mercado Pago
			window.location.href = initPoint

		} catch (error) {
			console.error('Checkout error:', error)
			alert('Error al procesar el pago. Por favor intenta de nuevo.')
			setIsProcessing(false)
		}
	}

	const handleTimeExpired = () => {
		setTimeExpired(true)
		alert('Tu reserva ha expirado')
		setTimeout(() => {
			router.push('/events')
		}, 2000)
	}

	if (timeExpired) {
		return (
			<div className="min-h-screen bg-deep-night flex items-center justify-center">
				<GlassCard className="p-8 text-center max-w-md">
					<div className="w-16 h-16 bg-warm-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-warm-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h2 className="text-display text-2xl text-soft-beige mb-2">
						Reserva Expirada
					</h2>
					<p className="text-soft-gray mb-4">
						Tu tiempo de reserva ha expirado. Los asientos han sido liberados.
					</p>
					<Button onClick={() => router.push('/events')} className="btn-primary">
						Volver a Eventos
					</Button>
				</GlassCard>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-deep-night">
			<div className="container mx-auto px-6 py-8">
				{/* Header with countdown */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h1 className="text-display text-4xl md:text-5xl text-soft-beige">
							Checkout
						</h1>
						<CountdownTimer expiresAt={expiresAt} onExpired={handleTimeExpired} />
					</div>
					<p className="text-soft-gray">
						Completa tu compra antes de que expire tu reserva
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Reservation Summary */}
						<ReservationSummary reservationsByEvent={order.reservationsByEvent} />

						{/* Product Cart */}
						<ProductCart
							products={products}
							cartItems={optimisticCartItems}
							onUpdateCart={handleCartUpdate}
						/>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Order Summary */}
						<OrderSummary
							totals={totals}
							user={order.user}
							onCheckout={handleCheckout}
							isProcessing={isProcessing}
							disabled={timeExpired}
						/>

						{/* Security info */}
						<GlassCard variant="subtle" className="p-4">
							<div className="flex items-start gap-3">
								<div className="w-5 h-5 bg-soft-gold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
									<svg className="w-3 h-3 text-deep-night" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
									</svg>
								</div>
								<div>
									<p className="text-soft-beige text-sm font-medium">
										Pago Seguro
									</p>
									<p className="text-soft-gray text-xs">
										Procesado por Mercado Pago con encriptación SSL
									</p>
								</div>
							</div>
						</GlassCard>
					</div>
				</div>
			</div>
		</div>
	)
} 