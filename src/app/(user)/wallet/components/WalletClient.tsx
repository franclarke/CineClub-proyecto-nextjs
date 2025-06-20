'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { WalletSummary } from './WalletSummary'
import { TicketsSection } from './TicketsSection'
import { ProductsSection } from './ProductsSection'
import { HistorySection } from './HistorySection'
import { ReservationsByEvent } from '@/types/api'
import { CalendarIcon, ShoppingBagIcon, HistoryIcon, WalletIcon, SearchIcon } from 'lucide-react'

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
	const [searchQuery, setSearchQuery] = useState('')

	// Calculate correct counts
	const ticketCount = Object.keys(reservationsByEvent).length
	const productOrdersCount = orders.filter(order => order.items.length > 0).length
	const totalTransactions = orders.length + ticketCount

	const tabs = [
		{
			id: 'tickets' as TabType,
			label: 'Tickets',
			count: ticketCount,
			icon: CalendarIcon,
			description: 'Eventos reservados'
		},
		{
			id: 'products' as TabType,
			label: 'Productos',
			count: productOrdersCount,
			icon: ShoppingBagIcon,
			description: 'Consumibles por canjear'
		},
		{
			id: 'history' as TabType,
			label: 'Historial',
			count: totalTransactions,
			icon: HistoryIcon,
			description: 'Todas las transacciones'
		}
	]

	const hasAnyContent = ticketCount > 0 || orders.length > 0

	// Empty state
	if (!hasAnyContent) {
		return (
			<div className="space-y-8">
				{/* Summary Cards - Show even when empty */}
				<WalletSummary summary={summary} />
				
				{/* Empty State */}
				<div className="text-center py-20">
					<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-lg mx-auto p-12">
						<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
							<WalletIcon className="w-10 h-10 text-sunset-orange" />
						</div>
						<h3 className="text-2xl font-bold text-soft-beige mb-4">
							Tu wallet está vacío
						</h3>
						<p className="text-soft-beige/60 mb-8 leading-relaxed">
							Cuando compres tickets o productos, aparecerán aquí para que puedas gestionarlos fácilmente
						</p>
						<Link
							href="/events"
							className="inline-flex items-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
						>
							<CalendarIcon className="w-5 h-5" />
							<span>Explorar Eventos</span>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// Render tab content based on active tab
	const renderTabContent = () => {
		if (activeTab === 'tickets') {
			return <TicketsSection reservationsByEvent={reservationsByEvent} searchQuery={searchQuery} />
		}
		if (activeTab === 'products') {
			return <ProductsSection orders={orders} searchQuery={searchQuery} />
		}
		if (activeTab === 'history') {
			return <HistorySection orders={orders} reservationsByEvent={reservationsByEvent} searchQuery={searchQuery} />
		}
		return null
	}

	return (
		<div className="space-y-8">
			{/* Summary Cards */}
			<WalletSummary summary={summary} />

			{/* Controls Section */}
			<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8">
				{/* Navigation Tabs */}
				<div className="flex flex-wrap gap-4 mb-8">
					{tabs.map((tab, index) => {
						const IconComponent = tab.icon
						const isActive = activeTab === tab.id
						
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`
									group flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300
									${isActive
										? 'bg-gradient-sunset-gold text-deep-night shadow-lg scale-[1.02]'
										: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]'
									}
								`}
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								<div className={`
									w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
									${isActive
										? 'bg-deep-night/20'
										: 'bg-sunset-orange/20'
									}
								`}>
									<IconComponent className={`
										w-5 h-5 transition-all duration-300
										${isActive 
											? 'text-deep-night' 
											: 'text-sunset-orange'
										}
									`} />
								</div>
								<div className="text-left">
									<div className="flex items-center gap-3">
										<span>{tab.label}</span>
										{tab.count > 0 && (
											<div className={`
												px-2.5 py-1 text-xs rounded-xl font-bold
												${isActive
													? 'bg-deep-night/20 text-deep-night'
													: 'bg-sunset-orange text-deep-night'
												}
											`}>
												{tab.count}
											</div>
										)}
									</div>
									<div className={`text-xs ${isActive ? 'text-deep-night/60' : 'text-soft-beige/60'}`}>
										{tab.description}
									</div>
								</div>
							</button>
						)
					})}
				</div>

				{/* Search Bar */}
				<div className="relative">
					<SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/40" />
					<input
						type="text"
						placeholder={`Buscar en ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}...`}
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full bg-soft-gray/20 border border-soft-gray/30 rounded-2xl pl-12 pr-6 py-4 text-soft-beige placeholder-soft-beige/40 focus:outline-none focus:border-sunset-orange/50 focus:bg-soft-gray/30 transition-all duration-300"
					/>
				</div>
			</div>

			{/* Tab Content */}
			<div className="min-h-[400px]">
				{renderTabContent()}
			</div>
		</div>
	)
} 