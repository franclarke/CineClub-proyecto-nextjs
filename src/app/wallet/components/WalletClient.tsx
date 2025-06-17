'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { GlassCard } from '@/app/components/ui/glass-card'
import { WalletSummary } from './WalletSummary'
import { TicketsSection } from './TicketsSection'
import { ProductsSection } from './ProductsSection'
import { HistorySection } from './HistorySection'
import { ReservationsByEvent } from '@/types/api'

type OrderWithExtras = Order & {
	items: (OrderItem & {
		product: Product
	})[]
	payment: Payment | null
}

interface Summary {
	totalTickets: number
	upcomingEvents: number
	pastEvents: number
	totalProducts: number
	totalSpent: number
}

interface WalletClientProps {
	reservationsByEvent: ReservationsByEvent
	orders: OrderWithExtras[]
	summary: Summary
}

type TabType = 'tickets' | 'products' | 'history'

export function WalletClient({ reservationsByEvent, orders, summary }: WalletClientProps) {
	const [activeTab, setActiveTab] = useState<TabType>('tickets')

	const tabs = [
		{
			id: 'tickets' as TabType,
			label: 'Mis Tickets',
			count: summary.totalTickets,
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
				</svg>
			)
		},
		{
			id: 'products' as TabType,
			label: 'Consumibles',
			count: summary.totalProducts,
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
				</svg>
			)
		},
		{
			id: 'history' as TabType,
			label: 'Historial',
			count: orders.length,
			icon: (
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
				</svg>
			)
		}
	]

	return (
		<div className="min-h-screen bg-deep-night">
			<div className="container mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-display text-4xl md:text-5xl text-soft-beige mb-2">
						Mi Wallet
					</h1>
					<p className="text-soft-gray">
						Gestiona tus tickets, productos y revisa tu historial de compras
					</p>
				</div>

				{/* Summary Cards */}
				<WalletSummary summary={summary} />

				{/* Navigation Tabs */}
				<div className="mb-8">
					<div className="flex flex-wrap gap-2">
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`
									flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-200
									${activeTab === tab.id
										? 'bg-sunset-orange text-deep-night shadow-lg'
										: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30'
									}
								`}
							>
								{tab.icon}
								<span>{tab.label}</span>
								{tab.count > 0 && (
									<span className={`
										px-2 py-1 text-xs rounded-full font-bold
										${activeTab === tab.id
											? 'bg-deep-night/20 text-deep-night'
											: 'bg-sunset-orange text-deep-night'
										}
									`}>
										{tab.count}
									</span>
								)}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				<div className="space-y-6">
					{activeTab === 'tickets' && (
						<TicketsSection reservationsByEvent={reservationsByEvent} />
					)}

					{activeTab === 'products' && (
						<ProductsSection orders={orders} />
					)}

					{activeTab === 'history' && (
						<HistorySection orders={orders} reservationsByEvent={reservationsByEvent} />
					)}
				</div>

				{/* Empty state */}
				{Object.keys(reservationsByEvent).length === 0 && orders.length === 0 && (
					<div className="text-center py-16">
						<GlassCard className="max-w-md mx-auto p-8">
							<div className="w-20 h-20 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
								<svg className="w-10 h-10 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
								</svg>
							</div>
							<h3 className="text-display text-xl text-soft-beige mb-2">
								Tu wallet está vacío
							</h3>
							<p className="text-soft-gray mb-6">
								Cuando compres tickets o productos, aparecerán aquí
							</p>
							<Link
								href="/events"
								className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg font-medium"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								Ver Eventos
							</Link>
						</GlassCard>
					</div>
				)}
			</div>
		</div>
	)
} 