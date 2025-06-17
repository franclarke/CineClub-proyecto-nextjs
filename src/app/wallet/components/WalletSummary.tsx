import { GlassCard } from '@/app/components/ui/glass-card'

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
			icon: (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
				</svg>
			),
			color: 'text-sunset-orange'
		},
		{
			label: 'Próximos Eventos',
			value: summary.upcomingEvents,
			icon: (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			),
			color: 'text-soft-gold'
		},
		{
			label: 'Productos Comprados',
			value: summary.totalProducts,
			icon: (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
			),
			color: 'text-soft-beige'
		},
		{
			label: 'Total Gastado',
			value: `$${summary.totalSpent.toFixed(2)}`,
			icon: (
				<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
				</svg>
			),
			color: 'text-warm-red'
		}
	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
			{summaryCards.map((card, index) => (
				<GlassCard key={index} variant="subtle" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-soft-gray text-sm mb-1">{card.label}</p>
							<p className={`text-2xl font-bold ${card.color}`}>
								{card.value}
							</p>
						</div>
						<div className={`${card.color} opacity-80`}>
							{card.icon}
						</div>
					</div>
				</GlassCard>
			))}
		</div>
	)
} 