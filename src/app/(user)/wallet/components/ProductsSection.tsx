import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { ShoppingBagIcon, CalendarIcon, QrCodeIcon, InfoIcon, CheckCircleIcon, FilterIcon } from 'lucide-react'

type OrderWithExtras = Order & {
	items: (OrderItem & {
		product: Product
	})[]
	payment: Payment | null
}

interface ProductsSectionProps {
	orders: OrderWithExtras[]
	searchQuery?: string
}

export function ProductsSection({ orders, searchQuery = '' }: ProductsSectionProps) {
	// Filter orders that have items (products) and match search query
	const ordersWithProducts = orders.filter(order => {
		if (order.items.length === 0) return false
		
		if (!searchQuery) return true
		
		// Search in order ID, product names, or order date
		const searchLower = searchQuery.toLowerCase()
		const matchesOrderId = order.id.toLowerCase().includes(searchLower)
		const matchesProduct = order.items.some(item => 
			item.product.name.toLowerCase().includes(searchLower)
		)
		const matchesDate = order.createdAt.toLocaleDateString('es-ES').includes(searchLower)
		
		return matchesOrderId || matchesProduct || matchesDate
	})

	if (orders.filter(order => order.items.length > 0).length === 0) {
		return (
			<div className="text-center py-20">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-lg mx-auto p-12">
					<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<ShoppingBagIcon className="w-10 h-10 text-sunset-orange" />
					</div>
					<h3 className="text-2xl font-bold text-soft-beige mb-4">
						No tienes productos
					</h3>
					<p className="text-soft-beige/60 mb-8 leading-relaxed">
						Los productos que compres aparecerán aquí para su canje
					</p>
					<Link
						href="/events"
						className="inline-flex items-center gap-3 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
					>
						<CalendarIcon className="w-5 h-5" />
						<span>Ver Eventos y Productos</span>
					</Link>
				</div>
			</div>
		)
	}

	if (ordersWithProducts.length === 0 && searchQuery) {
		return (
			<div className="text-center py-16">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-md mx-auto p-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<FilterIcon className="w-8 h-8 text-soft-gray" />
					</div>
					<p className="text-soft-beige/60 text-sm">
						No hay productos que coincidan con "{searchQuery}"
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className="space-y-8">
			{/* Search Results Info */}
			{searchQuery && (
				<div className="text-soft-beige/60 text-sm">
					{ordersWithProducts.length} resultado{ordersWithProducts.length !== 1 ? 's' : ''} 
					{ordersWithProducts.length > 0 && ` para "${searchQuery}"`}
				</div>
			)}

			{/* Products Grid */}
			<div className="space-y-6">
				{ordersWithProducts.map((order, index) => (
					<div
						key={order.id}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8 animate-fade-in hover-lift"
						style={{ animationDelay: `${index * 0.1}s` }}
					>
						<div className="flex items-start justify-between mb-8">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center">
									<ShoppingBagIcon className="w-7 h-7 text-soft-gold" />
								</div>
								<div>
									<h3 className="text-2xl font-bold text-soft-beige mb-2">
										Orden #{order.id.slice(-8)}
									</h3>
									<p className="text-soft-beige/60">
										{new Date(order.createdAt).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
								</div>
							</div>
							<div className="text-right">
								<div className="text-soft-beige font-bold text-xl mb-2">
									Total: ${order.totalAmount.toFixed(2)}
								</div>
								<div className={`
									px-4 py-2 rounded-xl text-sm font-bold border
									${order.status === 'paid' 
										? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' 
										: 'bg-soft-gray/20 text-soft-gray border-soft-gray/30'
									}
								`}>
									{order.status === 'paid' ? 'PAGADO' : order.status.toUpperCase()}
								</div>
							</div>
						</div>

						{/* Products */}
						<div className="space-y-6">
							<h4 className="text-soft-beige font-semibold text-lg">
								Productos ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
							</h4>
							
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{order.items.map((item, itemIndex) => (
									<div
										key={item.id}
										className="bg-soft-gray/10 border border-soft-gray/20 rounded-2xl p-6 hover:bg-soft-gray/20 transition-all duration-300 group"
										style={{ animationDelay: `${(index + itemIndex) * 0.05}s` }}
									>
										<div className="flex items-start justify-between mb-6">
											<div className="flex-1">
												<h5 className="text-soft-beige font-bold text-lg mb-3 group-hover:text-sunset-orange transition-colors duration-300">
													{item.product.name}
												</h5>
												<div className="space-y-2">
													<div className="flex justify-between text-soft-beige/80">
														<span>Cantidad:</span>
														<span className="font-semibold">{item.quantity}</span>
													</div>
													<div className="flex justify-between text-soft-beige/80">
														<span>Precio unitario:</span>
														<span className="font-semibold">${item.price.toFixed(2)}</span>
													</div>
													<div className="flex justify-between text-sunset-orange font-bold text-lg">
														<span>Subtotal:</span>
														<span>${(item.quantity * item.price).toFixed(2)}</span>
													</div>
												</div>
											</div>
										</div>
										
										<div className="flex items-center justify-between">
											{/* Status indicator */}
											<div className="flex items-center gap-3">
												<CheckCircleIcon className="w-5 h-5 text-soft-gold" />
												<span className="text-soft-gold font-semibold">
													LISTO PARA CANJEAR
												</span>
											</div>
											
											<button
												onClick={() => {
													// Generate QR for product pickup
													alert(`Código QR para canjear: ${item.id}`)
												}}
												className="flex items-center gap-2 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 text-sunset-orange px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-sunset-orange/30 hover:to-soft-gold/30 border border-sunset-orange/30 hover:scale-[1.02]"
											>
												<QrCodeIcon className="w-4 h-4" />
												<span>Generar QR</span>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Instructions */}
						<div className="mt-8 bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-2xl p-6">
							<div className="flex items-start gap-4">
								<div className="w-10 h-10 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
									<InfoIcon className="w-5 h-5 text-soft-gold" />
								</div>
								<div>
									<p className="text-soft-beige font-semibold mb-3">
										Instrucciones de Canje
									</p>
									<ul className="text-soft-beige/70 space-y-2 leading-relaxed">
										<li>• Presenta el código QR en el kiosco del evento</li>
										<li>• Los productos deben canjearse durante el evento</li>
										<li>• Algunos productos tienen fecha de caducidad</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
} 