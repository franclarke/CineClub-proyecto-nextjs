import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { GlassCard } from '@/app/components/ui/glass-card'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'

type OrderWithExtras = Order & {
	items: (OrderItem & {
		product: Product
	})[]
	payment: Payment | null
}

interface ProductsSectionProps {
	orders: OrderWithExtras[]
}

export function ProductsSection({ orders }: ProductsSectionProps) {
	// Filter orders that have items (products)
	const ordersWithProducts = orders.filter(order => order.items.length > 0)

	if (ordersWithProducts.length === 0) {
		return (
			<GlassCard className="p-8 text-center">
				<div className="w-20 h-20 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-6">
					<svg className="w-10 h-10 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
					</svg>
				</div>
				<h3 className="text-display text-xl text-soft-beige mb-2">
					No tienes productos
				</h3>
				<p className="text-soft-gray mb-6">
					Los productos que compres aparecerán aquí para su canje
				</p>
				<Link
					href="/events"
					className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-lg font-medium"
				>
					Ver Eventos y Productos
				</Link>
			</GlassCard>
		)
	}

	return (
		<div className="space-y-6">
			{ordersWithProducts.map((order) => (
				<GlassCard key={order.id} className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div>
							<h3 className="text-sunset-orange font-bold text-lg mb-1">
								Orden #{order.id.slice(-8)}
							</h3>
							<p className="text-soft-gray text-sm">
								{new Date(order.createdAt).toLocaleDateString('es-ES', {
									year: 'numeric',
									month: 'long',
									day: 'numeric',
									hour: '2-digit',
									minute: '2-digit'
								})}
							</p>
						</div>
						<div className="text-right">
							<div className="text-soft-beige font-medium">
								Total: ${order.totalAmount.toFixed(2)}
							</div>
							<div className={`
								px-3 py-1 rounded-full text-xs font-bold mt-2
								${order.status === 'paid' 
									? 'bg-soft-gold/20 text-soft-gold' 
									: 'bg-soft-gray/20 text-soft-gray'
								}
							`}>
								{order.status === 'paid' ? 'PAGADO' : order.status.toUpperCase()}
							</div>
						</div>
					</div>

					{/* Products */}
					<div className="space-y-4">
						<h4 className="text-soft-beige font-medium">
							Productos ({order.items.reduce((sum, item) => sum + item.quantity, 0)})
						</h4>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{order.items.map((item) => (
								<div
									key={item.id}
									className="flex items-center justify-between p-4 bg-soft-gray/10 rounded-lg border border-soft-gray/20"
								>
									<div className="flex-1">
										<h5 className="text-soft-beige font-medium mb-1">
											{item.product.name}
										</h5>
										<div className="text-soft-gray text-sm">
											Cantidad: {item.quantity} × ${item.price.toFixed(2)}
										</div>
										<div className="text-sunset-orange font-medium">
											Subtotal: ${(item.quantity * item.price).toFixed(2)}
										</div>
									</div>
									
									<div className="ml-4 text-center">
										{/* Status indicator - For now, all products are "Por canjear" */}
										<div className="bg-soft-gold/20 text-soft-gold px-3 py-1 rounded-full text-xs font-bold mb-2">
											POR CANJEAR
										</div>
										
										<Button
											size="sm"
											variant="outline"
											onClick={() => {
												// Generate QR for product pickup
												alert(`Código QR para canjear: ${item.id}`)
											}}
										>
											<svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
											</svg>
											QR
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Instructions */}
					<div className="mt-4 p-3 bg-soft-gray/10 rounded-lg">
						<div className="flex items-start gap-3">
							<svg className="w-5 h-5 text-soft-gold mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<div>
								<p className="text-soft-beige text-sm font-medium mb-1">
									Instrucciones de Canje
								</p>
								<ul className="text-soft-gray text-xs space-y-1">
									<li>• Presenta el código QR en el kiosco del evento</li>
									<li>• Los productos deben canjearse durante el evento</li>
									<li>• Algunos productos tienen fecha de caducidad</li>
								</ul>
							</div>
						</div>
					</div>
				</GlassCard>
			))}
		</div>
	)
} 