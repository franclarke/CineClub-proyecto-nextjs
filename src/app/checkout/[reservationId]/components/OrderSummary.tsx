import { User, MembershipTier } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'

interface Totals {
	tickets: number
	products: number
	total: number
}

interface OrderSummaryProps {
	totals: Totals
	user: User & {
		membership: MembershipTier
	}
	onCheckout: () => void
	isProcessing: boolean
	disabled: boolean
}

export function OrderSummary({ totals, user, onCheckout, isProcessing, disabled }: OrderSummaryProps) {
	// Calculate membership discount (example: 10% for Gold, 5% for Silver)
	const membershipDiscount = user.membership.name === 'Gold' ? 0.10 : user.membership.name === 'Silver' ? 0.05 : 0
	const discountAmount = totals.total * membershipDiscount
	const finalTotal = totals.total - discountAmount

	return (
		<GlassCard className="p-6">
			<h3 className="text-display text-xl text-soft-beige mb-4">
				Resumen de Orden
			</h3>

			<div className="space-y-4">
				{/* User info */}
				<div className="pb-4 border-b border-soft-gray/20">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
							<svg className="w-5 h-5 text-soft-gold" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
							</svg>
						</div>
						<div>
							<p className="text-soft-beige font-medium">
								{user.name || user.email}
							</p>
							<p className="text-soft-gray text-sm">
								Membresía {user.membership.name}
							</p>
						</div>
					</div>
				</div>

				{/* Order breakdown */}
				<div className="space-y-3">
					{totals.tickets > 0 && (
						<div className="flex justify-between items-center">
							<span className="text-soft-beige">Tickets</span>
							<span className="text-soft-beige font-medium">
								${totals.tickets}
							</span>
						</div>
					)}

					{totals.products > 0 && (
						<div className="flex justify-between items-center">
							<span className="text-soft-beige">Food & Drinks</span>
							<span className="text-soft-beige font-medium">
								${totals.products}
							</span>
						</div>
					)}

					<div className="border-t border-soft-gray/20 pt-3">
						<div className="flex justify-between items-center">
							<span className="text-soft-beige">Subtotal</span>
							<span className="text-soft-beige font-medium">
								${totals.total}
							</span>
						</div>
					</div>

					{/* Membership discount */}
					{membershipDiscount > 0 && (
						<div className="flex justify-between items-center">
							<span className="text-soft-gold text-sm">
								Descuento {user.membership.name} ({(membershipDiscount * 100).toFixed(0)}%)
							</span>
							<span className="text-soft-gold font-medium">
								-${discountAmount.toFixed(2)}
							</span>
						</div>
					)}

					{/* Final total */}
					<div className="border-t border-soft-gray/20 pt-3">
						<div className="flex justify-between items-center">
							<span className="text-soft-beige font-bold text-lg">Total</span>
							<span className="text-sunset-orange font-bold text-xl">
								${finalTotal.toFixed(2)}
							</span>
						</div>
					</div>
				</div>

				{/* Checkout button */}
				<div className="pt-4">
					<Button
						onClick={onCheckout}
						disabled={disabled || isProcessing || totals.total === 0}
						loading={isProcessing}
						className="w-full btn-primary py-3 font-medium text-lg"
					>
						{isProcessing ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
								<span>Procesando...</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
								</svg>
								<span>Pagar con Mercado Pago</span>
							</div>
						)}
					</Button>
				</div>

				{/* Payment methods info */}
				<div className="text-center">
					<p className="text-soft-gray text-xs">
						Aceptamos tarjetas de crédito, débito, transferencia bancaria y más
					</p>
				</div>
			</div>
		</GlassCard>
	)
} 