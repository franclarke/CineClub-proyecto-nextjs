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

export function WalletSummary({ summary }: WalletSummaryProps) {
	const summaryCards = [
		{
			label: 'Tickets Totales',
			value: summary.totalTickets,
			icon: TicketIcon,
			color: 'text-sunset-orange',
			bgColor: 'from-sunset-orange/20 to-sunset-orange/5',
			borderColor: 'border-sunset-orange/30'
		},
		{
			label: 'Próximos Eventos',
			value: summary.upcomingEvents,
			icon: CalendarIcon,
			color: 'text-soft-gold',
			bgColor: 'from-soft-gold/20 to-soft-gold/5',
			borderColor: 'border-soft-gold/30'
		},
		{
			label: 'Productos Comprados',
			value: summary.totalProducts,
			icon: ShoppingBagIcon,
			color: 'text-soft-beige',
			bgColor: 'from-soft-beige/20 to-soft-beige/5',
			borderColor: 'border-soft-beige/30'
		},
		{
			label: 'Total Gastado',
			value: `$${summary.totalSpent.toFixed(2)}`,
			icon: DollarSignIcon,
			color: 'text-green-400',
			bgColor: 'from-green-400/20 to-green-400/5',
			borderColor: 'border-green-400/30'
		}
	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
			{summaryCards.map((card, index) => {
				const IconComponent = card.icon
				return (
					<div
						key={index}
						className={`
							bg-soft-beige/5 backdrop-blur-xl border ${card.borderColor} rounded-3xl p-8 
							hover-lift group cursor-pointer transition-all duration-300 hover:scale-[1.02]
						`}
						style={{ animationDelay: `${index * 0.1}s` }}
					>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<p className="text-soft-beige/60 text-sm mb-3 font-medium uppercase tracking-wide">
									{card.label}
								</p>
								<p className={`text-3xl font-bold ${card.color} group-hover:scale-110 transition-transform duration-300`}>
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
						<div className="mt-6 pt-4 border-t border-soft-beige/10">
							<div className="flex items-center justify-between text-xs">
								<span className="text-soft-beige/40">Estado</span>
								<span className={`font-semibold ${card.color}`}>
									{card.value === 0 || card.value === '$0.00' ? 'Vacío' : 'Activo'}
								</span>
							</div>
						</div>
					</div>
				)
			})}
		</div>
	)
} 
