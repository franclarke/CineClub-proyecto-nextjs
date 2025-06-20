import { Separator } from '@/app/components/ui/separator'
import { Tag, Calculator, Sparkles } from 'lucide-react'

interface ReservationData {
	id: string
	createdAt: Date
	event: {
		title: string
		dateTime: Date
	}
	seat: {
		seatNumber: string
	}
}

interface CartItem {
	id: string
	price: number
	quantity: number
	product: {
		name: string
	}
}

interface OrderSummaryProps {
	reservation: ReservationData
	cartItems: CartItem[]
	membershipDiscount: number
	total: number
}

export function OrderSummary({ cartItems, membershipDiscount }: OrderSummaryProps) {
	const ticketPrice = 25 // Precio base del ticket
	const subtotal = ticketPrice + cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
	const discountAmount = subtotal * (membershipDiscount / 100)
	const finalTotal = subtotal - discountAmount

	return (
		<div className="space-y-6">
			{/* Order breakdown */}
			<div className="space-y-3">
				<div className="flex justify-between items-center">
					<span className="text-soft-beige/80 text-sm">Ticket de evento</span>
					<span className="text-soft-beige font-medium">
						${ticketPrice}
					</span>
				</div>

				{cartItems.length > 0 && (
					<div className="flex justify-between items-center">
						<span className="text-soft-beige/80 text-sm">Food & Drinks ({cartItems.length})</span>
						<span className="text-soft-beige font-medium">
							${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
						</span>
					</div>
				)}

				<Separator />

				<div className="flex justify-between items-center">
					<span className="text-soft-beige/80 text-sm">Subtotal</span>
					<span className="text-soft-beige font-medium">
						${subtotal.toFixed(2)}
					</span>
				</div>

				{/* Membership discount */}
				{membershipDiscount > 0 && (
					<div className="flex justify-between items-center">
						<span className="text-soft-gold text-sm flex items-center gap-2">
							<Tag className="w-3 h-3" />
							Descuento membresía ({membershipDiscount}%)
						</span>
						<span className="text-soft-gold font-medium">
							-${discountAmount.toFixed(2)}
						</span>
					</div>
				)}

				<Separator />

				{/* Final total */}
				<div className="flex justify-between items-center pt-2">
					<span className="text-soft-beige font-bold text-lg flex items-center gap-2">
						<Calculator className="w-4 h-4" />
						Total
					</span>
					<span className="text-sunset-orange font-bold text-xl">
						${finalTotal.toFixed(2)}
					</span>
				</div>
			</div>

			{/* Membership badge */}
			{membershipDiscount > 0 && (
				<div className="bg-soft-gold/20 border border-soft-gold/30 rounded-xl p-3">
					<div className="flex items-center justify-center gap-2">
						<Sparkles className="w-4 h-4 text-soft-gold" />
						<span className="text-soft-gold text-sm font-medium">
							Beneficios de membresía aplicados
						</span>
					</div>
				</div>
			)}
		</div>
	)
} 