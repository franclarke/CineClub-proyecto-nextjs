'use client'

import { useState, useMemo, useCallback } from 'react'
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
	paidOrders: OrderWithExtras[]
	allOrders: OrderWithExtras[]
	summary: Summary
}

type TabType = 'tickets' | 'products' | 'history'

interface TabInfo {
	id: TabType
	label: string
	count: number
	icon: React.ComponentType<{ className?: string }>
	description: string
}

export function WalletClient({ reservationsByEvent, paidOrders, allOrders, summary }: WalletClientProps) {
	const [activeTab, setActiveTab] = useState<TabType>('tickets')
	const [searchQuery, setSearchQuery] = useState('')

	// Memoized counts calculation for performance
	const counts = useMemo(() => {
		const ticketCount = Object.keys(reservationsByEvent).length
		const totalTransactions = allOrders.length + ticketCount

		return {
			tickets: ticketCount,
			products: summary.totalProducts, // Use the total products from summary
			transactions: totalTransactions
		}
	}, [reservationsByEvent, allOrders, summary.totalProducts])

	// Memoized tabs configuration
	const tabs = useMemo<TabInfo[]>(() => [
		{
			id: 'tickets',
			label: 'Tickets',
			count: counts.tickets,
			icon: CalendarIcon,
			description: 'Eventos reservados'
		},
		{
			id: 'products',
			label: 'Productos',
			count: counts.products,
			icon: ShoppingBagIcon,
			description: 'Consumibles por canjear'
		},
		{
			id: 'history',
			label: 'Historial',
			count: counts.transactions,
			icon: HistoryIcon,
			description: 'Todas las transacciones'
		}
	], [counts])

	// Memoized content availability check
	const hasAnyContent = useMemo(() =>
		counts.tickets > 0 || allOrders.length > 0,
		[counts.tickets, allOrders.length]
	)

	// Optimized event handlers
	const handleTabChange = useCallback((tabId: TabType) => {
		setActiveTab(tabId)
		// Clear search when switching tabs for better UX
		setSearchQuery('')
	}, [])

	const handleSearchChange = useCallback((value: string) => {
		setSearchQuery(value)
	}, [])

	// Memoized tab content renderer
	const renderTabContent = useMemo(() => {
		const contentMap = {
			tickets: <TicketsSection reservationsByEvent={reservationsByEvent} searchQuery={searchQuery} />,
			products: <ProductsSection orders={paidOrders} searchQuery={searchQuery} />,
			history: <HistorySection orders={allOrders} reservationsByEvent={reservationsByEvent} searchQuery={searchQuery} />
		}
		return contentMap[activeTab] || null
	}, [activeTab, reservationsByEvent, paidOrders, allOrders, searchQuery])

	// Memoized search placeholder
	const searchPlaceholder = useMemo(() => {
		const currentTab = tabs.find(t => t.id === activeTab)
		return `Buscar en ${currentTab?.label.toLowerCase()}...`
	}, [tabs, activeTab])

	// Empty state component
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

	return (
		<div className="space-y-8">
			{/* Summary Cards */}
			<WalletSummary summary={summary} />

			{/* Controls Section */}
			<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8">
				{/* Navigation Tabs */}
				<div className="flex flex-wrap gap-4 justify-center">
					{tabs.map((tab, index) => {
						const IconComponent = tab.icon
						const isActive = activeTab === tab.id

						return (
							<button
								key={tab.id}
								onClick={() => handleTabChange(tab.id)}
								className={`
									group flex items-center gap-4 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 cursor-pointer
									${isActive
										? 'bg-gradient-sunset-gold text-deep-night shadow-lg scale-[1.02]'
										: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20 hover:scale-[1.02]'
									}
								`}
								style={{ animationDelay: `${index * 0.1}s` }}
								aria-pressed={isActive}
								aria-label={`Ver ${tab.label}`}
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
			</div>

			{/* Tab Content */}
			<div className="min-h-[400px]" role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
				{renderTabContent}
			</div>
		</div>
	)
} 
