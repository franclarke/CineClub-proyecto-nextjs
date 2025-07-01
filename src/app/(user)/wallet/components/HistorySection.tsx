import { useMemo } from 'react'
import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { ReservationsByEvent, EventWithReservations } from '@/types/api'
import { ShoppingBagIcon, TicketIcon, CalendarIcon, CreditCardIcon, HistoryIcon, FilterIcon } from 'lucide-react'

type OrderWithExtras = Order & {
	items: (OrderItem & {
		product: Product
	})[]
	payment: Payment | null
}

interface HistorySectionProps {
	orders: OrderWithExtras[]
	reservationsByEvent: ReservationsByEvent
	searchQuery?: string
}

type TransactionType = {
	type: 'order' | 'reservation'
	id: string
	date: Date
	amount: number
	status: string
	data: OrderWithExtras | EventWithReservations
	searchableText: string
}

export function HistorySection({ orders, reservationsByEvent, searchQuery = '' }: HistorySectionProps) {
	// Memoized transactions processing for better performance
	const { allTransactions, hasTransactions } = useMemo(() => {
		const orderTransactions: TransactionType[] = orders.map(order => ({
			type: 'order' as const,
			id: order.id,
			date: order.createdAt,
			amount: order.totalAmount,
			status: order.status,
			data: order,
			searchableText: `${order.id} ${order.items.map(item => item.product.name).join(' ')}`
		}))

		const reservationTransactions: TransactionType[] = Object.values(reservationsByEvent).map(({ event, reservations }) => ({
			type: 'reservation' as const,
			id: event.id,
			date: reservations[0]?.createdAt || event.createdAt,
			amount: reservations.length * 25, // Base ticket price
			status: 'confirmed' as const,
			data: { event, reservations },
			searchableText: `${event.title} ${event.location}`
		}))

		const combined = [...orderTransactions, ...reservationTransactions]
		const hasAny = combined.length > 0

		// Apply search filter if provided
		const filtered = !searchQuery 
			? combined 
			: combined.filter(transaction => {
				const searchLower = searchQuery.toLowerCase()
				return transaction.searchableText.toLowerCase().includes(searchLower) ||
					   transaction.date.toLocaleDateString('es-ES').includes(searchLower) ||
					   transaction.amount.toString().includes(searchLower)
			})

		// Sort by date (newest first)
		const sorted = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		return { allTransactions: sorted, hasTransactions: hasAny }
	}, [orders, reservationsByEvent, searchQuery])

	// Format currency helper
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount)
	}

	// Empty state when no transactions exist
	if (!hasTransactions) {
		return (
			<div className="text-center py-20">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-lg mx-auto p-12">
					<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<HistoryIcon className="w-10 h-10 text-sunset-orange" />
					</div>
					<h3 className="text-2xl font-bold text-soft-beige mb-4">
						Sin historial
					</h3>
					<p className="text-soft-beige/60 leading-relaxed">
						Tus compras y reservas aparecerán aquí
					</p>
				</div>
			</div>
		)
	}

	// No search results state
	if (allTransactions.length === 0 && searchQuery) {
		return (
			<div className="text-center py-16">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-md mx-auto p-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<FilterIcon className="w-8 h-8 text-soft-gray" />
					</div>
					<p className="text-soft-beige/60 text-sm">
						No hay transacciones que coincidan con &quot;{searchQuery}&quot;
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Search Results Info */}
			{searchQuery && (
				<div className="text-soft-beige/60 text-sm" role="status" aria-live="polite">
					{allTransactions.length} resultado{allTransactions.length !== 1 ? 's' : ''} 
					{allTransactions.length > 0 && ` para "${searchQuery}"`}
				</div>
			)}

			{/* Transactions List */}
			<div className="space-y-6">
				{allTransactions.map((transaction, index) => (
					<article
						key={`${transaction.type}-${transaction.id}`}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8 animate-fade-in hover-lift"
						style={{ animationDelay: `${index * 0.05}s` }}
						aria-labelledby={`transaction-${transaction.type}-${transaction.id}`}
					>
						{transaction.type === 'order' ? (
							<OrderHistoryItem 
								order={transaction.data as OrderWithExtras} 
								formatCurrency={formatCurrency}
								transactionId={`transaction-${transaction.type}-${transaction.id}`}
							/>
						) : (
							<ReservationHistoryItem 
								data={transaction.data as EventWithReservations} 
								formatCurrency={formatCurrency}
								transactionId={`transaction-${transaction.type}-${transaction.id}`}
							/>
						)}
					</article>
				))}
			</div>
		</div>
	)
}

interface ItemProps {
	formatCurrency: (amount: number) => string
	transactionId: string
}

interface OrderHistoryItemProps extends ItemProps {
	order: OrderWithExtras
}

function OrderHistoryItem({ order, formatCurrency, transactionId }: OrderHistoryItemProps) {
	const hasProducts = order.items.length > 0

	return (
		<div className="flex items-start justify-between">
			<div className="flex-1">
				<header className="flex items-center gap-4 mb-6">
					<div className="w-14 h-14 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-2xl flex items-center justify-center">
						{hasProducts ? (
							<ShoppingBagIcon className="w-7 h-7 text-sunset-orange" />
						) : (
							<TicketIcon className="w-7 h-7 text-sunset-orange" />
						)}
					</div>
					<div>
						<h3 id={transactionId} className="text-soft-beige font-bold text-xl">
							{hasProducts ? 'Compra de Productos' : 'Compra de Tickets'}
						</h3>
						<p className="text-soft-beige/60">
							Orden #{order.id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString('es-ES', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</p>
					</div>
				</header>

				{hasProducts && (
					<section className="ml-18 mb-6">
						<div className="bg-soft-gray/10 border border-soft-gray/20 rounded-2xl p-4">
							<p className="text-soft-beige/80 font-medium mb-3">Productos:</p>
							<div className="text-soft-beige/60">
								{order.items.map((item, index) => (
									<span key={item.id}>
										{item.quantity}× {item.product.name}
										{index < order.items.length - 1 && ', '}
									</span>
								))}
							</div>
						</div>
					</section>
				)}

				{order.payment && (
					<footer className="ml-18">
						<div className="flex items-center gap-2 text-soft-beige/60 text-sm">
							<CreditCardIcon className="w-4 h-4" />
							<span>
								Pago: {order.payment.provider || 'Mercado Pago'} • {order.payment.paymentDate ? 
									new Date(order.payment.paymentDate).toLocaleDateString('es-ES') : 
									'Fecha no disponible'}
							</span>
						</div>
					</footer>
				)}
			</div>

			<div className="text-right">
				<div className="text-soft-beige font-bold text-2xl mb-3">
					{formatCurrency(order.totalAmount)}
				</div>
				<div className={`
					px-4 py-2 rounded-xl text-sm font-bold border
					${order.status === 'paid' 
						? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' 
						: order.status === 'pending'
						? 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30'
						: 'bg-red-500/20 text-red-400 border-red-500/30'
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

interface ReservationHistoryItemProps extends ItemProps {
	data: EventWithReservations
}

function ReservationHistoryItem({ data, formatCurrency, transactionId }: ReservationHistoryItemProps) {
	const { event, reservations } = data
	const eventDate = new Date(event.dateTime)
	const isUpcoming = eventDate > new Date()

	return (
		<div className="flex items-start justify-between">
			<div className="flex-1">
				<header className="flex items-center gap-4 mb-6">
					<div className="w-14 h-14 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center">
						<TicketIcon className="w-7 h-7 text-soft-gold" />
					</div>
					<div>
						<h3 id={transactionId} className="text-soft-beige font-bold text-xl">
							{event.title}
						</h3>
						<div className="flex items-center gap-2 text-soft-beige/60">
							<CalendarIcon className="w-4 h-4" />
							<span>
								{eventDate.toLocaleDateString('es-ES', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</span>
						</div>
					</div>
				</header>

				<section className="ml-18">
					<div className="bg-soft-gray/10 border border-soft-gray/20 rounded-2xl p-4 mb-3">
						<p className="text-soft-beige/80 font-medium mb-2">
							{reservations.length} asiento{reservations.length > 1 ? 's' : ''}:
						</p>
						<div className="flex flex-wrap gap-2" role="list">
							{reservations.map(r => (
								<span key={r.id} className="bg-soft-gray/20 px-3 py-1 rounded-lg text-sm text-soft-beige" role="listitem">
									#{r.seat.seatNumber}
								</span>
							))}
						</div>
					</div>
					<div className="text-soft-beige/60 text-sm">
						📍 {event.location}
					</div>
				</section>
			</div>

			<div className="text-right">
				<div className="text-soft-beige font-bold text-2xl mb-3">
					{formatCurrency(reservations.length * 25)}
				</div>
				<div className={`
					px-4 py-2 rounded-xl text-sm font-bold border
					${isUpcoming 
						? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' 
						: 'bg-soft-gray/20 text-soft-gray border-soft-gray/30'
					}
				`}>
					{isUpcoming ? 'PRÓXIMO' : 'COMPLETADO'}
				</div>
			</div>
		</div>
	)
} 
