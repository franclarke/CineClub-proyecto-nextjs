'use client'

import { useState } from 'react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/cart-context'
import { ProductCartItem, SeatCartItem } from '@/types/cart'
import { 
	ShoppingCart, 
	CreditCard, 
	Package, 
	Trash2, 
	Plus, 
	Minus, 
	ArrowRight, 
	Sparkles,
	Shield,
	CheckCircle,
	AlertTriangle,
	Info,
	Loader2,
	Lock,
	Ticket,
	Calendar,
	MapPin
} from 'lucide-react'
import { formatFullDate } from '@/lib/utils/date'

type UserWithMembership = User & {
	membership: {
		id: string
		name: string
		description: string | null
		priority: number
		price: number
		benefits: string | null
	}
}

interface CheckoutClientProps {
	user: UserWithMembership
}

export function CheckoutClient({ user }: CheckoutClientProps) {
	const router = useRouter()
	const { state: cartState, clearCart, removeItem, updateProductQuantity } = useCart()
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [discountCode, setDiscountCode] = useState('')
	const [appliedDiscount, setAppliedDiscount] = useState(0)

	// Obtener todos los items del carrito
	const allItems = cartState.items
	const productItems = cartState.items.filter(item => item.type === 'product') as ProductCartItem[]
	const seatItems = cartState.items.filter(item => item.type === 'seat') as SeatCartItem[]
	
	// Calcular descuento basado en el nombre de la membresía
	const membershipDiscount = user.membership?.name === 'Oro' ? 15 : 
		user.membership?.name === 'Plata' ? 10 : 
		user.membership?.name === 'Bronce' ? 5 : 0
	
	// Calcular totales con TODOS los items
	const subtotal = allItems.reduce((acc, item) => 
		acc + item.totalPrice, 0
	)
	const membershipDiscountAmount = subtotal * (membershipDiscount / 100)
	const additionalDiscountAmount = subtotal * (appliedDiscount / 100)
	const totalDiscount = membershipDiscountAmount + additionalDiscountAmount
	const total = subtotal - totalDiscount

	const updateQuantity = async (productId: string, newQuantity: number) => {
		if (newQuantity < 1) return
		updateProductQuantity(productId, newQuantity)
	}

	const removeItemFromCart = async (itemId: string) => {
		removeItem(itemId)
	}

	const applyDiscountCode = async () => {
		if (!discountCode.trim()) return

		setIsLoading(true)
		setError(null)

		try {
			const response = await fetch('/api/discounts/apply', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ code: discountCode })
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || 'Código de descuento inválido')
			}

			const { discount } = await response.json()
			setAppliedDiscount(discount.percentage)
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Error al aplicar el código de descuento')
		} finally {
			setIsLoading(false)
		}
	}

	const proceedToPayment = async () => {
		if (allItems.length === 0) return

		setIsLoading(true)
		setError(null)
		
		try {
			// Enviar TODOS los items al endpoint
			const response = await fetch('/api/payments/create-preference', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ 
					items: allItems,
					discountCode: appliedDiscount > 0 ? discountCode : null
				})
			})

			if (!response.ok) {
				const error = await response.json()
				throw new Error(error.error || 'Error al crear la preferencia de pago')
			}

			const { initPoint, sandboxInitPoint } = await response.json()
			
			const checkoutUrl = process.env.NODE_ENV === 'development' ? sandboxInitPoint : initPoint
			
			if (checkoutUrl) {
				// Limpiar carrito del contexto antes de redirigir
				clearCart()
				window.location.href = checkoutUrl
			} else {
				throw new Error('URL de checkout no disponible')
			}

		} catch (error) {
			console.error('Error en checkout:', error)
			setError(error instanceof Error ? error.message : 'Error al procesar el checkout. Por favor, intenta nuevamente.')
		} finally {
			setIsLoading(false)
		}
	}

	if (allItems.length === 0) {
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
						Agrega productos a tu carrito para continuar con el checkout
					</p>
					<button
						onClick={() => router.push('/shop')}
						className="inline-flex items-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
					>
						<Package className="w-5 h-5" />
						<span>Ir a la Tienda</span>
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			{/* Productos y Resumen */}
			<div className="lg:col-span-2 space-y-6">
				{/* Header con información de seguridad */}
				<div className="bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-2xl p-4">
					<div className="flex items-center gap-3">
						<Shield className="w-5 h-5 text-soft-gold" />
						<p className="text-soft-beige text-sm">
							<span className="font-semibold">Compra 100% segura</span> • Todos tus datos están protegidos
						</p>
					</div>
				</div>

				{/* Lista de asientos reservados */}
				{seatItems.length > 0 && (
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-soft-beige flex items-center gap-3">
								<Ticket className="w-6 h-6 text-soft-gold" />
								Asientos Reservados
							</h2>
							<span className="text-soft-beige/60 text-sm">
								{seatItems.length} {seatItems.length === 1 ? 'asiento' : 'asientos'}
							</span>
						</div>

						<div className="space-y-4">
							{seatItems.map((item) => (
								<div
									key={item.id}
									className="group relative bg-soft-gray/5 rounded-xl border border-soft-gray/10 hover:border-soft-gray/20 transition-all duration-200 p-4"
								>
									<div className="flex items-center space-x-4">
										<div className="w-16 h-16 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
											<Ticket className="w-8 h-8 text-soft-gold" />
										</div>

										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-soft-beige mb-1">
												{item.event.title}
											</h3>
											<div className="space-y-1 text-soft-beige/60 text-sm">
												<p className="flex items-center gap-2">
													<MapPin className="w-3 h-3" />
													Asiento {item.seatNumber} - Tier {item.tier}
												</p>
												<p className="flex items-center gap-2">
													<Calendar className="w-3 h-3" />
													{formatFullDate(item.event.dateTime)}
												</p>
											</div>
										</div>

										<div className="text-right">
											<div className="font-bold text-sunset-orange text-lg">
												${item.totalPrice.toFixed(2)}
											</div>
										</div>

										<button
											onClick={() => removeItemFromCart(item.id)}
											className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 rounded-lg flex items-center justify-center transition-colors duration-200 group"
										>
											<Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Lista de productos */}
				{productItems.length > 0 && (
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex items-center justify-between mb-6">
							<h2 className="text-xl font-bold text-soft-beige flex items-center gap-3">
								<Package className="w-6 h-6 text-soft-gold" />
								Productos
							</h2>
							<span className="text-soft-beige/60 text-sm">
								{productItems.length} {productItems.length === 1 ? 'producto' : 'productos'}
							</span>
						</div>

						<div className="space-y-4">
							{productItems.map((item) => {
								const isItemLoading = loadingItems.has(item.product.id)
								return (
									<div
										key={item.id}
										className="group relative bg-soft-gray/5 rounded-xl border border-soft-gray/10 hover:border-soft-gray/20 transition-all duration-200 p-4"
									>
										{isItemLoading && (
											<div className="absolute inset-0 bg-deep-night/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
												<Loader2 className="w-6 h-6 text-sunset-orange animate-spin" />
											</div>
										)}

										<div className="flex items-center space-x-4">
											<div className="w-16 h-16 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-lg flex items-center justify-center flex-shrink-0">
												<Package className="w-8 h-8 text-soft-gold" />
											</div>

											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-soft-beige mb-1 truncate">
													{item.product.name}
												</h3>
												<p className="text-soft-beige/60 text-sm">
													${item.product.price.toFixed(2)} por unidad
												</p>
											</div>

											<div className="flex items-center space-x-3">
												<div className="flex items-center space-x-2 bg-deep-night/50 rounded-lg p-1">
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
														disabled={isItemLoading || item.quantity >= 10}
														className="w-8 h-8 bg-soft-gray/20 hover:bg-soft-gray/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200"
													>
														<Plus className="w-4 h-4 text-soft-beige" />
													</button>
												</div>

												<div className="text-right">
													<div className="font-bold text-sunset-orange text-lg">
														${item.totalPrice.toFixed(2)}
													</div>
												</div>

												<button
													onClick={() => removeItemFromCart(item.id)}
													disabled={isItemLoading}
													className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-colors duration-200 group"
												>
													<Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
												</button>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}

				{/* Código de descuento */}
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
					<h3 className="text-lg font-bold text-soft-beige mb-4 flex items-center gap-3">
						<Sparkles className="w-5 h-5 text-soft-gold" />
						Código de Descuento
					</h3>
					
					{appliedDiscount > 0 ? (
						<div className="bg-soft-gold/20 border border-soft-gold/30 rounded-xl p-4">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<CheckCircle className="w-5 h-5 text-soft-gold" />
									<span className="text-soft-gold font-medium">
										Descuento del {appliedDiscount}% aplicado
									</span>
								</div>
								<button
									onClick={() => {
										setAppliedDiscount(0)
										setDiscountCode('')
									}}
									className="text-soft-gold/80 hover:text-soft-gold text-sm underline"
								>
									Quitar
								</button>
							</div>
						</div>
					) : (
						<div className="flex gap-3">
							<input
								type="text"
								value={discountCode}
								onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
								placeholder="Ingresa tu código"
								className="flex-1 px-4 py-2.5 bg-soft-gray/10 border border-soft-gray/20 rounded-xl text-soft-beige placeholder-soft-beige/50 focus:border-sunset-orange focus:outline-none focus:ring-1 focus:ring-sunset-orange/20"
								disabled={isLoading}
							/>
							<button
								onClick={applyDiscountCode}
								disabled={isLoading || !discountCode.trim()}
								className="px-6 py-2.5 bg-soft-gold/20 text-soft-gold border border-soft-gold/30 rounded-xl font-medium hover:bg-soft-gold/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<Loader2 className="w-5 h-5 animate-spin" />
								) : (
									'Aplicar'
								)}
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Resumen y Pago */}
			<div className="space-y-6">
				{/* Resumen de Orden */}
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6 sticky top-24">
					<div className="flex items-center space-x-3 mb-6">
						<div className="w-1 h-6 bg-gradient-to-b from-soft-gold to-sunset-orange rounded-full"></div>
						<h3 className="text-xl font-bold text-soft-beige">
							Total a Pagar
						</h3>
					</div>

					<div className="space-y-3 mb-6">
						<div className="flex justify-between items-center">
							<span className="text-soft-beige/70">
								Subtotal ({allItems.length} {allItems.length === 1 ? 'item' : 'items'})
							</span>
							<span className="text-soft-beige font-medium">${subtotal.toFixed(2)}</span>
						</div>
						
						{user.membership && membershipDiscountAmount > 0 && (
							<div className="flex justify-between items-center text-soft-gold">
								<span className="flex items-center gap-2">
									<Sparkles className="w-4 h-4" />
									Descuento {user.membership.name} ({membershipDiscount}%)
								</span>
								<span>-${membershipDiscountAmount.toFixed(2)}</span>
							</div>
						)}

						{appliedDiscount > 0 && (
							<div className="flex justify-between items-center text-soft-gold">
								<span>Código de descuento ({appliedDiscount}%)</span>
								<span>-${additionalDiscountAmount.toFixed(2)}</span>
							</div>
						)}
						
						<div className="h-px bg-gradient-to-r from-transparent via-soft-gray/30 to-transparent my-4"></div>
						
						<div className="flex justify-between items-center py-2 bg-soft-gold/10 rounded-xl px-4">
							<span className="text-xl font-bold text-soft-beige">Total Final</span>
							<span className="text-2xl font-bold text-sunset-orange">${total.toFixed(2)}</span>
						</div>
					</div>

					{user.membership && (
						<div className="flex items-center gap-2 bg-soft-gold/10 border border-soft-gold/20 rounded-lg px-3 py-2 mb-6">
							<Info className="w-4 h-4 text-soft-gold" />
							<span className="text-soft-gold text-sm">
								Eres miembro {user.membership.name} • Descuento aplicado
							</span>
						</div>
					)}

					{error && (
						<div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
							<div className="flex items-start gap-3">
								<AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
								<p className="text-red-300 text-sm">{error}</p>
							</div>
						</div>
					)}

					<button
						onClick={proceedToPayment}
						disabled={isLoading || allItems.length === 0}
						className="w-full bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night py-5 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 group"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-6 h-6 animate-spin" />
								<span>Procesando...</span>
							</>
						) : (
							<>
								<Lock className="w-5 h-5 group-hover:hidden" />
								<CreditCard className="w-5 h-5 hidden group-hover:block" />
								<span>Proceder a Pagar con MercadoPago</span>
								<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</>
						)}
					</button>

					<div className="mt-4 space-y-3">
						<div className="flex items-center justify-center gap-2 text-soft-beige/50 text-xs">
							<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							<span>Serás redirigido a MercadoPago para completar el pago</span>
						</div>
						
						<p className="text-center text-soft-beige/40 text-xs">
							Al continuar, aceptas nuestros términos y condiciones
						</p>
					</div>
				</div>

				{/* Información adicional */}
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
					<h4 className="font-semibold text-soft-beige mb-4 flex items-center gap-2">
						<Shield className="w-5 h-5 text-soft-gold" />
						Información Importante
					</h4>
					<div className="space-y-3 text-sm text-soft-beige/60">
						<p className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-soft-gold/60 flex-shrink-0 mt-0.5" />
							<span>Aceptamos todas las tarjetas de crédito y débito</span>
						</p>
						<p className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-soft-gold/60 flex-shrink-0 mt-0.5" />
							<span>Puedes pagar en cuotas sin interés según tu banco</span>
						</p>
						<p className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-soft-gold/60 flex-shrink-0 mt-0.5" />
							<span>Tu información está protegida con encriptación SSL</span>
						</p>
						<p className="flex items-start gap-2">
							<CheckCircle className="w-4 h-4 text-soft-gold/60 flex-shrink-0 mt-0.5" />
							<span>Recibirás el comprobante por email inmediatamente</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
} 