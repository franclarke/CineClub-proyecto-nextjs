import Link from 'next/link'
import { useMemo, useCallback, useState } from 'react'
import { Order, OrderItem, Product, Payment } from '@prisma/client'
import { ShoppingBagIcon, CalendarIcon, CheckCircleIcon, QrCodeIcon, InfoIcon, FilterIcon, XIcon } from 'lucide-react'

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

// QR Modal Component
interface QRModalProps {
	isOpen: boolean
	onClose: () => void
	productName: string
	itemId: string
	orderId: string
}

function QRModal({ isOpen, onClose, productName, itemId, orderId }: QRModalProps) {
	const [qrError, setQrError] = useState(false)
	
	const generateQRData = useCallback(() => {
		const qrData = {
			type: 'product_redemption',
			productName,
			itemId,
			orderId,
			timestamp: new Date().toISOString(),
			venue: 'CineClub Puff & Chill',
			validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
		}
		return encodeURIComponent(JSON.stringify(qrData))
	}, [productName, itemId, orderId])

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${generateQRData()}&bgcolor=1a1a1a&color=f5f5dc&margin=20&ecc=M&format=png`

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-soft-beige/10 backdrop-blur-xl border border-soft-beige/20 rounded-3xl max-w-md w-full p-8 animate-scale-in">
				<div className="flex items-center justify-between mb-6">
					<h3 className="text-2xl font-bold text-soft-beige">Código QR</h3>
					<button
						onClick={onClose}
						className="w-10 h-10 bg-soft-gray/20 hover:bg-soft-gray/30 rounded-xl flex items-center justify-center transition-all duration-200"
						aria-label="Cerrar modal"
					>
						<XIcon className="w-5 h-5 text-soft-beige" />
					</button>
				</div>
				
				<div className="text-center">
					<div className="bg-white p-6 rounded-2xl mb-6 shadow-lg">
						{!qrError ? (
							<img
								src={qrUrl}
								alt={`Código QR para ${productName}`}
								className="w-full h-auto rounded-xl"
								onError={() => setQrError(true)}
							/>
						) : (
							<div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
								<div className="text-center">
									<QrCodeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
									<p className="text-gray-600 text-sm">Error al generar QR</p>
								</div>
							</div>
						)}
					</div>
					
					<div className="space-y-4">
						<div>
							<h4 className="text-lg font-semibold text-soft-beige mb-2">{productName}</h4>
							<p className="text-soft-beige/60 text-sm">ID: {itemId.slice(-8)}</p>
						</div>
						
						<div className="bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-2xl p-4">
							<div className="flex items-start gap-3">
								<InfoIcon className="w-5 h-5 text-soft-gold flex-shrink-0 mt-0.5" />
								<div className="text-left">
									<p className="text-soft-beige/80 text-sm leading-relaxed">
										Presenta este código en el kiosco del evento para canjear tu producto. 
										Válido por 24 horas desde su generación.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export function ProductsSection({ orders, searchQuery = '' }: ProductsSectionProps) {
	const [selectedQR, setSelectedQR] = useState<{
		productName: string
		itemId: string
		orderId: string
	} | null>(null)

	// Memoized filtered orders for performance
	const { ordersWithProducts, hasProducts } = useMemo(() => {
		const withProducts = orders.filter(order => order.items.length > 0)
		const hasAnyProducts = withProducts.length > 0
		
		if (!searchQuery) {
			return { ordersWithProducts: withProducts, hasProducts: hasAnyProducts }
		}
		
		// Search optimization
		const searchLower = searchQuery.toLowerCase()
		const filtered = withProducts.filter(order => {
			const matchesOrderId = order.id.toLowerCase().includes(searchLower)
			const matchesProduct = order.items.some(item => 
				item.product.name.toLowerCase().includes(searchLower)
			)
			const matchesDate = order.createdAt.toLocaleDateString('es-ES').includes(searchLower)
			
			return matchesOrderId || matchesProduct || matchesDate
		})
		
		return { ordersWithProducts: filtered, hasProducts: hasAnyProducts }
	}, [orders, searchQuery])

	// Optimized QR generation handler
	const handleShowQR = useCallback((itemId: string, productName: string, orderId: string) => {
		setSelectedQR({ productName, itemId, orderId })
	}, [])

	const handleCloseQR = useCallback(() => {
		setSelectedQR(null)
	}, [])

	// Format currency helper
	const formatCurrency = useCallback((amount: number) => {
		return new Intl.NumberFormat('es-ES', {
			style: 'currency',
			currency: 'ARS',
			minimumFractionDigits: 2
		}).format(amount)
	}, [])

	// Empty state when no products exist
	if (!hasProducts) {
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

	// No search results state
	if (ordersWithProducts.length === 0 && searchQuery) {
		return (
			<div className="text-center py-16">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-md mx-auto p-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
						<FilterIcon className="w-8 h-8 text-soft-gray" />
					</div>
					<p className="text-soft-beige/60 text-sm">
						No hay productos que coincidan con &quot;{searchQuery}&quot;
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
					{ordersWithProducts.length} resultado{ordersWithProducts.length !== 1 ? 's' : ''} 
					{ordersWithProducts.length > 0 && ` para "${searchQuery}"`}
				</div>
			)}

			{/* Products Grid */}
			<div className="space-y-6">
				{ordersWithProducts.map((order, index) => {
					const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
					
					return (
						<article
							key={order.id}
							className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8 animate-fade-in hover-lift"
							style={{ animationDelay: `${index * 0.1}s` }}
							aria-labelledby={`order-${order.id}`}
						>
							<header className="flex items-start justify-between mb-8">
								<div className="flex items-center gap-4">
									<div className="w-14 h-14 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center">
										<ShoppingBagIcon className="w-7 h-7 text-soft-gold" />
									</div>
									<div>
										<h3 id={`order-${order.id}`} className="text-2xl font-bold text-soft-beige mb-2">
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
										Total: {formatCurrency(order.totalAmount)}
									</div>
									<div className={`
										px-4 py-2 rounded-xl text-sm font-bold border
										${order.status === 'paid' 
											? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' 
											: order.status === 'pending'
											? 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30'
											: 'bg-soft-gray/20 text-soft-gray border-soft-gray/30'
										}
									`}>
										{order.status === 'paid' ? 'PAGADO' : 
										 order.status === 'pending' ? 'PENDIENTE' : 
										 order.status.toUpperCase()}
									</div>
								</div>
							</header>

							{/* Products */}
							<section className="space-y-6">
								<h4 className="text-soft-beige font-semibold text-lg">
									Productos ({totalItems})
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
															<span className="font-semibold">{formatCurrency(item.price)}</span>
														</div>
														<div className="flex justify-between text-sunset-orange font-bold text-lg">
															<span>Subtotal:</span>
															<span>{formatCurrency(item.quantity * item.price)}</span>
														</div>
													</div>
												</div>
											</div>
											
											<div className="flex items-center justify-between">
												{/* Status indicator - different based on order status */}
												<div className="flex items-center gap-3">
													<CheckCircleIcon className={`w-5 h-5 ${
														order.status === 'paid' ? 'text-soft-gold' : 'text-sunset-orange'
													}`} />
													<span className={`font-semibold ${
														order.status === 'paid' ? 'text-soft-gold' : 'text-sunset-orange'
													}`}>
														{order.status === 'paid' ? 'LISTO PARA CANJEAR' : 'PAGO PENDIENTE'}
													</span>
												</div>
												
												{/* Only show QR generation for paid orders */}
												{order.status === 'paid' && (
													<button
														onClick={() => handleShowQR(item.id, item.product.name, order.id)}
														className="flex items-center gap-2 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 text-sunset-orange px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-sunset-orange/30 hover:to-soft-gold/30 border border-sunset-orange/30 hover:scale-[1.02]"
														aria-label={`Generar código QR para ${item.product.name}`}
													>
														<QrCodeIcon className="w-4 h-4" />
														<span>Ver QR</span>
													</button>
												)}
											</div>
										</div>
									))}
								</div>
							</section>

							{/* Instructions - conditional based on status */}
							<aside className="mt-8 bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-2xl p-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-xl flex items-center justify-center flex-shrink-0">
										<InfoIcon className="w-5 h-5 text-soft-gold" />
									</div>
									<div>
										<h5 className="text-soft-beige font-semibold mb-3">
											{order.status === 'paid' ? 'Instrucciones de Canje' : 'Estado del Pedido'}
										</h5>
										<ul className="text-soft-beige/70 space-y-2 leading-relaxed" role="list">
											{order.status === 'paid' ? (
												<>
													<li>• Presenta el código QR en el kiosco del evento</li>
													<li>• Los productos deben canjearse durante el evento</li>
													<li>• El código QR es válido por 24 horas desde su generación</li>
												</>
											) : (
												<>
													<li>• El pago de esta orden aún está pendiente</li>
													<li>• Los productos estarán disponibles una vez confirmado el pago</li>
													<li>• Recibirás una notificación cuando el pago sea procesado</li>
												</>
											)}
										</ul>
									</div>
								</div>
							</aside>
						</article>
					)
				})}
			</div>

			{/* QR Modal */}
			{selectedQR && (
				<QRModal
					isOpen={!!selectedQR}
					onClose={handleCloseQR}
					productName={selectedQR.productName}
					itemId={selectedQR.itemId}
					orderId={selectedQR.orderId}
				/>
			)}
		</div>
	)
} 
