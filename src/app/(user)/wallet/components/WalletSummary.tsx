import { useMemo } from 'react'
import { CalendarIcon, TicketIcon, ShoppingBagIcon, DollarSignIcon } from 'lucide-react'

interface Summary {
	totalTickets: number
	upcomingEvents: number
	pastEvents: number
	totalProducts: number
	totalSpent: number
}

interface WalletSummaryProps {
	summary: Summary
}

interface SummaryCard {
	label: string
	value: string | number
	icon: React.ComponentType<{ className?: string }>
	color: string
	bgColor: string
	borderColor: string
	status: 'empty' | 'active'
}

export function WalletSummary({ summary }: WalletSummaryProps) {
	// Memoized summary cards for performance
	const summaryCards = useMemo<SummaryCard[]>(() => {
		const formatCurrency = (amount: number) => {
			return new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'ARS',
				minimumFractionDigits: 0
			}).format(amount)
		}

		return [
			{
				label: 'Tickets Totales',
				value: summary.totalTickets,
				icon: TicketIcon,
				color: 'text-sunset-orange',
				bgColor: 'from-sunset-orange/20 to-sunset-orange/5',
				borderColor: 'border-sunset-orange/30',
				status: summary.totalTickets > 0 ? 'active' : 'empty'
			},
			{
				label: 'Próximos Eventos',
				value: summary.upcomingEvents,
				icon: CalendarIcon,
				color: 'text-soft-gold',
				bgColor: 'from-soft-gold/20 to-soft-gold/5',
				borderColor: 'border-soft-gold/30',
				status: summary.upcomingEvents > 0 ? 'active' : 'empty'
			},
			{
				label: 'Productos Comprados',
				value: summary.totalProducts,
				icon: ShoppingBagIcon,
				color: 'text-soft-beige',
				bgColor: 'from-soft-beige/20 to-soft-beige/5',
				borderColor: 'border-soft-beige/30',
				status: summary.totalProducts > 0 ? 'active' : 'empty'
			},
			{
				label: 'Total Gastado',
				value: formatCurrency(summary.totalSpent),
				icon: DollarSignIcon,
				color: 'text-green-600',
				bgColor: 'from-green-400/20 to-green-400/5',
				borderColor: 'border-green-400/30',
				status: summary.totalSpent > 0 ? 'active' : 'empty'
			}
		]
	}, [summary])

	return (
		<section className="animate-fade-in" aria-labelledby="wallet-summary">
			<h2 id="wallet-summary" className="sr-only">
				Resumen de la wallet
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{summaryCards.map((card, index) => {
					const IconComponent = card.icon
					return (
						<article
							key={index}
							className={`
								bg-soft-beige/5 backdrop-blur-xl border ${card.borderColor} rounded-3xl p-8 
								hover-lift group transition-all duration-300 
							`}
							style={{ animationDelay: `${index * 0.1}s` }}
							aria-labelledby={`summary-card-${index}`}
							role="button"
							tabIndex={0}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									// Optional: Add click handler functionality here
									e.preventDefault()
								}
							}}
						>
							<div className="flex items-center justify-between">
								<div className="flex-1">
									<p className="text-soft-beige/60 text-sm mb-3 font-medium uppercase tracking-wide">
										{card.label}
									</p>
									<p
										id={`summary-card-${index}`}
										className={`text-3xl font-bold ${card.color} group-hover:scale-110 transition-transform duration-300`}
										aria-label={`${card.label}: ${card.value}`}
									>
										{card.value}
									</p>
								</div>
								<div className={`
									w-16 h-16 bg-gradient-to-r ${card.bgColor} rounded-2xl 
									flex items-center justify-center group-hover:scale-110 
									transition-transform duration-300 border ${card.borderColor}
								`}>
									<IconComponent className={`w-8 h-8 ${card.color}`} />
								</div>
							</div>

							{/* Progress indicator */}
							<footer className="mt-6 pt-4 border-t border-soft-beige/10">
								<div className="flex items-center justify-between text-xs">
									<span className="text-soft-beige/40">Estado</span>
									<span className={`font-semibold ${card.color}`}>
										{card.status === 'empty' ? 'Vacío' : 'Activo'}
									</span>
								</div>
							</footer>
						</article>
					)
				})}
			</div>
		</section>
	)
} 
