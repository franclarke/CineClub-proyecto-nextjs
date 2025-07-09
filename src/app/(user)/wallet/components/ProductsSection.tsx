import Link from 'next/link'
import Image from 'next/image'
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
	productImage?: string
}

function QRModal({ isOpen, onClose, productName, itemId, orderId, productImage }: QRModalProps) {
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

	const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${generateQRData()}&bgcolor=1a1a1a&color=f5f5dc&margin=15&ecc=M&format=png`

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
						<div className="flex items-center justify-center gap-4">
							{productImage && (
								<div className="w-12 h-12 relative rounded-xl overflow-hidden">
									<Image
										src={productImage}
										alt={productName}
										fill
										className="object-cover"
									/>
								</div>
							)}
							<div>
								<h4 className="text-lg font-semibold text-soft-beige mb-1">{productName}</h4>
								<p className="text-soft-beige/60 text-sm">ID: {itemId.slice(-8)}</p>
							</div>
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
		productImage?: string
	} | null>(null)

	// Memoized product cards data - flatten all items into individual cards
	const productCards = useMemo(() => {
		const allItems: Array<{
			id: string
			productName: string
			productImage?: string
			quantity: number
			price: number
			orderId: string
			orderDate: Date
			totalAmount: number
		}> = []

		orders.forEach(order => {
			order.items.forEach(item => {
				allItems.push({
					id: item.id,
					productName: item.product.name,
					productImage: item.product.imageUrl || undefined,
					quantity: item.quantity,
					price: item.price,
					orderId: order.id,
					orderDate: order.createdAt,
					totalAmount: item.quantity * item.price
				})
			})
		})

		return allItems
	}, [orders])

	// Memoized filtered products for search
	const filteredProducts = useMemo(() => {
		if (!searchQuery) return productCards
		
		const searchLower = searchQuery.toLowerCase()
		return productCards.filter(product => 
			product.productName.toLowerCase().includes(searchLower) ||
			product.orderId.toLowerCase().includes(searchLower)
		)
	}, [productCards, searchQuery])

	// Optimized QR generation handler
	const handleShowQR = useCallback((itemId: string, productName: string, orderId: string, productImage?: string) => {
		setSelectedQR({ productName, itemId, orderId, productImage })
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
	if (productCards.length === 0) {
		return (
			<div className="text-center py-20">
				<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl max-w-lg mx-auto p-12">
					<div className="w-20 h-20 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
						<ShoppingBagIcon className="w-10 h-10 text-sunset-orange" />
					</div>
					<h3 className="text-2xl font-bold text-soft-beige mb-4">
						No tienes productos pagados
					</h3>
					<p className="text-soft-beige/60 mb-8 leading-relaxed">
						Los productos que compres y sean pagados aparecerán aquí para su canje
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
	if (filteredProducts.length === 0 && searchQuery) {
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
					{filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} 
					{filteredProducts.length > 0 && ` encontrado${filteredProducts.length !== 1 ? 's' : ''} para "${searchQuery}"`}
				</div>
			)}

			{/* Products Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProducts.map((product, index) => (
					<article
						key={product.id}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-6 animate-fade-in hover-lift group"
						style={{ animationDelay: `${index * 0.1}s` }}
						aria-labelledby={`product-${product.id}`}
					>
						{/* Product Image */}
						<div className="relative w-full h-48 mb-6 rounded-2xl overflow-hidden bg-soft-gray/10">
							{product.productImage ? (
								<Image
									src={product.productImage}
									alt={product.productName}
									fill
									className="object-cover transition-transform duration-300 group-hover:scale-105"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center">
									<ShoppingBagIcon className="w-16 h-16 text-soft-gray/40" />
								</div>
							)}
							
							{/* Quantity Badge */}
							<div className="absolute top-4 right-4 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-3 py-1 rounded-full text-sm font-bold shadow-lg">
								{product.quantity}x
							</div>
						</div>

						{/* Product Info */}
						<div className="space-y-4">
							<div>
								<h3 id={`product-${product.id}`} className="text-xl font-bold text-soft-beige mb-2 group-hover:text-sunset-orange transition-colors">
									{product.productName}
								</h3>
								<p className="text-soft-beige/60 text-sm">
									Orden #{product.orderId.slice(-8)} • {new Date(product.orderDate).toLocaleDateString('es-ES')}
								</p>
							</div>

							{/* Pricing */}
							<div className="bg-soft-gray/10 rounded-2xl p-4 space-y-2">
								<div className="flex justify-between text-soft-beige/80">
									<span>Precio unitario:</span>
									<span className="font-semibold">{formatCurrency(product.price)}</span>
								</div>
								<div className="flex justify-between text-soft-beige/80">
									<span>Cantidad disponible:</span>
									<span className="font-semibold text-sunset-orange">{product.quantity}</span>
								</div>
								<div className="flex justify-between text-sunset-orange font-bold text-lg pt-2 border-t border-soft-gray/20">
									<span>Total:</span>
									<span>{formatCurrency(product.totalAmount)}</span>
								</div>
							</div>

							{/* Status and Actions */}
							<div className="space-y-4">
								{/* Status indicator */}
								<div className="flex items-center gap-3">
									<CheckCircleIcon className="w-5 h-5 text-soft-gold" />
									<span className="text-soft-gold font-semibold">
										LISTO PARA CANJEAR
									</span>
								</div>
								
								{/* QR Button */}
								<button
									onClick={() => handleShowQR(product.id, product.productName, product.orderId, product.productImage)}
									className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 text-sunset-orange px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-sunset-orange/30 hover:to-soft-gold/30 border border-sunset-orange/30 hover:scale-[1.02] group"
									aria-label={`Generar código QR para ${product.productName}`}
								>
									<QrCodeIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
									<span>Generar QR</span>
								</button>
							</div>
						</div>
					</article>
				))}
			</div>

			{/* Instructions */}
			<div className="bg-gradient-to-r from-soft-gold/10 to-sunset-orange/10 border border-soft-gold/20 rounded-3xl p-8">
				<div className="flex items-start gap-4">
					<div className="w-12 h-12 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center flex-shrink-0">
						<InfoIcon className="w-6 h-6 text-soft-gold" />
					</div>
					<div>
						<h3 className="text-soft-beige font-bold text-lg mb-4">
							Instrucciones de Canje
						</h3>
						<ul className="text-soft-beige/70 space-y-3 leading-relaxed" role="list">
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-sunset-orange rounded-full mt-2 flex-shrink-0"></span>
								<span>Genera el código QR del producto que deseas canjear</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-sunset-orange rounded-full mt-2 flex-shrink-0"></span>
								<span>Presenta el código QR en el kiosco del evento</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-sunset-orange rounded-full mt-2 flex-shrink-0"></span>
								<span>Los productos deben canjearse durante el evento</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="w-2 h-2 bg-sunset-orange rounded-full mt-2 flex-shrink-0"></span>
								<span>El código QR es válido por 24 horas desde su generación</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* QR Modal */}
			{selectedQR && (
				<QRModal
					isOpen={!!selectedQR}
					onClose={handleCloseQR}
					productName={selectedQR.productName}
					itemId={selectedQR.itemId}
					orderId={selectedQR.orderId}
					productImage={selectedQR.productImage}
				/>
			)}
		</div>
	)
} 
