'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReservationSummary } from './ReservationSummary'
import { ProductCart } from './ProductCart'
import { OrderSummary } from './OrderSummary'
import { CountdownTimer } from './CountdownTimer'
import { CheckoutData } from '@/types/api'
import { Separator } from '@/app/components/ui/separator'
import { 
	AlertCircle, 
	CheckCircle, 
	CreditCard, 
	ShieldCheck, 
	Clock,
	Calculator
} from 'lucide-react'

interface CheckoutClientProps {
	data: CheckoutData
}

export function CheckoutClient({ data }: CheckoutClientProps) {
	const router = useRouter()
	const [isProcessing, setIsProcessing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handlePayment = async () => {
		setIsProcessing(true)
		setError(null)

		try {
			const response = await fetch('/api/payments/create-preference', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					reservationId: data.reservation.id,
					items: data.cartItems
				})
			})

			const result = await response.json()

			if (!response.ok) {
				throw new Error(result.error || 'Error al procesar el pago')
			}

			// Redirect to MercadoPago
			window.location.href = result.init_point
		} catch (error) {
			console.error('Payment error:', error)
			setError(error instanceof Error ? error.message : 'Error al procesar el pago')
		} finally {
			setIsProcessing(false)
		}
	}

	const handleTimeExpired = () => {
		router.push('/events')
	}

	return (
		<div className="space-y-8">
			{/* Countdown Timer Section */}
			<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
				<div className="flex items-center gap-4 mb-4">
					<div className="w-12 h-12 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
						<Clock className="w-6 h-6 text-red-400" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-soft-beige">Tiempo Restante</h3>
						<p className="text-soft-beige/60 text-sm">Tu reserva expira pronto</p>
					</div>
				</div>
				<CountdownTimer
					expiresAt={data.reservation.expiresAt}
					onExpire={handleTimeExpired}
				/>
			</div>

			<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="xl:col-span-2 space-y-8">
					{/* Reservation Summary */}
					<div className="space-y-6">
						<div className="flex items-center space-x-3">
							<div className="w-1 h-6 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full"></div>
							<h2 className="text-2xl font-bold text-soft-beige">Tu Reserva</h2>
						</div>
						
						<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
							<ReservationSummary
								reservation={data.reservation}
								event={data.event}
								seat={data.seat}
							/>
						</div>
					</div>

					{/* Product Cart */}
					<div className="space-y-6">
						<div className="flex items-center space-x-3">
							<div className="w-1 h-6 bg-gradient-to-b from-soft-gold to-sunset-orange rounded-full"></div>
							<h2 className="text-2xl font-bold text-soft-beige">Productos</h2>
						</div>
						
						<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
							<ProductCart
								items={data.cartItems}
								availableProducts={data.availableProducts}
							/>
						</div>
					</div>

					{/* Security Info */}
					<div className="space-y-6">
						<div className="flex items-center space-x-3">
							<div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
							<h2 className="text-2xl font-bold text-soft-beige">Pago Seguro</h2>
						</div>
						
						<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center">
									<ShieldCheck className="w-6 h-6 text-green-400" />
								</div>
								<div>
									<h3 className="text-lg font-bold text-soft-beige">Protegido por MercadoPago</h3>
									<p className="text-soft-beige/60 text-sm">Tus datos están completamente seguros</p>
								</div>
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex items-center gap-3 p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20">
									<CheckCircle className="w-5 h-5 text-green-400" />
									<div>
										<p className="text-soft-beige font-medium text-sm">Encriptación SSL</p>
										<p className="text-soft-beige/60 text-xs">Datos protegidos</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20">
									<CheckCircle className="w-5 h-5 text-green-400" />
									<div>
										<p className="text-soft-beige font-medium text-sm">Compra Garantizada</p>
										<p className="text-soft-beige/60 text-xs">100% seguro</p>
									</div>
								</div>
								<div className="flex items-center gap-3 p-4 bg-soft-gray/10 rounded-xl border border-soft-gray/20">
									<CheckCircle className="w-5 h-5 text-green-400" />
									<div>
										<p className="text-soft-beige font-medium text-sm">Soporte 24/7</p>
										<p className="text-soft-beige/60 text-xs">Asistencia completa</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Order Summary Sidebar */}
				<div className="space-y-6">
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6 sticky top-24">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-12 h-12 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl flex items-center justify-center">
								<Calculator className="w-6 h-6 text-sunset-orange" />
							</div>
							<div>
								<h3 className="text-xl font-bold text-soft-beige">Resumen de Compra</h3>
								<p className="text-soft-beige/60 text-sm">Revisa tu orden</p>
							</div>
						</div>

						<OrderSummary
							reservation={data.reservation}
							cartItems={data.cartItems}
							membershipDiscount={data.membershipDiscount}
							total={data.total}
						/>

						<Separator className="my-6" />

						{/* Error Display */}
						{error && (
							<div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
								<div className="flex items-center gap-3">
									<AlertCircle className="w-5 h-5 text-red-400" />
									<div>
										<p className="text-red-400 font-medium text-sm">Error en el pago</p>
										<p className="text-red-300/80 text-xs">{error}</p>
									</div>
								</div>
							</div>
						)}

						{/* Payment Button */}
						<button
							onClick={handlePayment}
							disabled={isProcessing}
							className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group disabled:opacity-50 disabled:cursor-not-allowed text-sm"
						>
							{isProcessing ? (
								<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
							) : (
								<>
									<CreditCard className="w-5 h-5" />
									<span>Pagar ${data.total.toFixed(2)}</span>
								</>
							)}
						</button>

						{/* Terms */}
						<p className="text-soft-beige/50 text-xs text-center mt-4 leading-relaxed">
							Al proceder con el pago, aceptas nuestros{' '}
							<span className="text-soft-gold hover:underline cursor-pointer">
								términos y condiciones
							</span>{' '}
							y{' '}
							<span className="text-soft-gold hover:underline cursor-pointer">
								política de privacidad
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	)
} 