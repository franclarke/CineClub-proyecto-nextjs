import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { GlassCard } from '@/app/components/ui/glass-card'
import { ReservationsByEvent, EventWithReservations } from '@/types/api'

type OrderWithExtras = Order & {
	items: (OrderItem & {
		product: Product
	})[]
	payment: Payment | null
}

interface HistorySectionProps {
	orders: OrderWithExtras[]
	reservationsByEvent: ReservationsByEvent
}

export function HistorySection({ orders, reservationsByEvent }: HistorySectionProps) {
	// Combine and sort all transactions by date
	const allTransactions = [
		...orders.map(order => ({
			type: 'order' as const,
			id: order.id,
			date: order.createdAt,
			amount: order.totalAmount,
			status: order.status,
			data: order
		})),
		...Object.values(reservationsByEvent).map(({ event, reservations }) => ({
			type: 'reservation' as const,
			id: event.id,
			date: reservations[0]?.createdAt || event.createdAt,
			amount: reservations.length * 25, // Base ticket price
			status: 'confirmed',
			data: { event, reservations }
		}))
	].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	if (allTransactions.length === 0) {
		return (
			<GlassCard className="p-8 text-center">
				<div className="w-20 h-20 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg className="w-10 h-10 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
					</svg>
				</div>
				<h3 className="text-display text-xl text-soft-beige mb-2">
					Sin historial
				</h3>
				<p className="text-soft-gray">
					Tus compras y reservas aparecerán aquí
				</p>
			</GlassCard>
		)
	}

	return (
		<div className="space-y-4">
			{allTransactions.map((transaction) => (
				<GlassCard key={`${transaction.type}-${transaction.id}`} className="p-6">
					{transaction.type === 'order' ? (
						<OrderHistoryItem order={transaction.data as OrderWithExtras} />
					) : (
						<ReservationHistoryItem data={transaction.data as EventWithReservations} />
					)}
				</GlassCard>
			))}
		</div>
	)
}

function OrderHistoryItem({ order }: { order: OrderWithExtras }) {
	const hasProducts = order.items.length > 0

	return (
		<div className="flex items-start justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 bg-sunset-orange/20 rounded-full flex items-center justify-center">
						{hasProducts ? (
							<svg className="w-5 h-5 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
							</svg>
						) : (
							<svg className="w-5 h-5 text-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
							</svg>
						)}
					</div>
					<div>
						<h3 className="text-soft-beige font-semibold">
							{hasProducts ? 'Compra de Productos' : 'Compra de Tickets'}
						</h3>
						<p className="text-soft-gray text-sm">
							Orden #{order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</p>
					</div>
				</div>

				{hasProducts && (
					<div className="ml-13 mb-3">
						<div className="text-soft-gray text-sm">
							{order.items.map((item, index) => (
								<span key={item.id}>
									{item.quantity}× {item.product.name}
									{index < order.items.length - 1 && ', '}
								</span>
							))}
						</div>
					</div>
				)}

				{order.payment && (
					<div className="ml-13">
						<div className="text-soft-gray text-xs">
							Pago: {order.payment.provider || 'Mercado Pago'} • {order.payment.paymentDate ? 
								new Date(order.payment.paymentDate).toLocaleDateString('es-ES') : 
								'Fecha no disponible'}
						</div>
					</div>
				)}
			</div>

			<div className="text-right">
				<div className="text-soft-beige font-bold text-lg">
					${order.totalAmount.toFixed(2)}
				</div>
				<div className={`
					px-3 py-1 rounded-full text-xs font-bold
					${order.status === 'paid' 
						? 'bg-soft-gold/20 text-soft-gold' 
						: order.status === 'pending'
						? 'bg-sunset-orange/20 text-sunset-orange'
						: 'bg-warm-red/20 text-warm-red'
					}
				`}>
					{order.status === 'paid' ? 'PAGADO' : 
					 order.status === 'pending' ? 'PENDIENTE' : 
					 order.status.toUpperCase()}
				</div>
			</div>
		</div>
	)
}

function ReservationHistoryItem({ data }: { data: EventWithReservations }) {
	const { event, reservations } = data
	const eventDate = new Date(event.dateTime)
	const isUpcoming = eventDate > new Date()

	return (
		<div className="flex items-start justify-between">
			<div className="flex-1">
				<div className="flex items-center gap-3 mb-2">
					<div className="w-10 h-10 bg-soft-gold/20 rounded-full flex items-center justify-center">
						<svg className="w-5 h-5 text-soft-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
						</svg>
					</div>
					<div>
						<h3 className="text-soft-beige font-semibold">
							{event.title}
						</h3>
						<p className="text-soft-gray text-sm">
							{eventDate.toLocaleDateString('es-ES', {
								weekday: 'long',
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</p>
					</div>
				</div>

				<div className="ml-13">
					<div className="text-soft-gray text-sm">
						{reservations.length} asiento{reservations.length > 1 ? 's' : ''}: {
							reservations.map(r => `#${r.seat.seatNumber}`).join(', ')
						}
					</div>
					<div className="text-soft-gray text-xs">
						{event.location}
					</div>
				</div>
			</div>

			<div className="text-right">
				<div className="text-soft-beige font-bold text-lg">
					${(reservations.length * 25).toFixed(2)}
				</div>
				<div className={`
					px-3 py-1 rounded-full text-xs font-bold
					${isUpcoming 
						? 'bg-soft-gold/20 text-soft-gold' 
						: 'bg-soft-gray/20 text-soft-gray'
					}
				`}>
					{isUpcoming ? 'PRÓXIMO' : 'COMPLETADO'}
				</div>
			</div>
		</div>
	)
} 