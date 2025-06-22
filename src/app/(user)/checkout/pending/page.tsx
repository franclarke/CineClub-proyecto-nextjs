import { Metadata } from 'next'
import { Clock, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Pago Pendiente | Puff & Chill',
	description: 'Tu pago está siendo procesado'
}

interface SearchParams {
	order_id?: string
	payment_id?: string
}

export default function CheckoutPendingPage({
	searchParams
}: {
	searchParams: Promise<SearchParams>
}) {
	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90 flex items-center justify-center">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-3xl p-12">
					{/* Pending Icon */}
					<div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
						<Clock className="w-12 h-12 text-yellow-400 animate-pulse" />
					</div>

					{/* Pending Message */}
					<h1 className="text-4xl font-bold text-soft-beige mb-4">
						Pago en Proceso
					</h1>
					
					<p className="text-soft-beige/70 text-lg mb-8 leading-relaxed">
						Tu pago está siendo procesado. Esto puede tomar unos minutos dependiendo del método de pago seleccionado.
					</p>

					{/* Status Info */}
					<div className="bg-soft-gray/10 rounded-2xl p-6 mb-8">
						<div className="flex items-center justify-center gap-3 mb-4">
							<div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
							<span className="text-yellow-400 font-medium">Procesando...</span>
						</div>
						
						<div className="space-y-3 text-sm text-soft-beige/70">
							<div className="flex items-center justify-between">
								<span>Estado del pago:</span>
								<span className="text-yellow-400">Pendiente de aprobación</span>
							</div>
							<div className="flex items-center justify-between">
								<span>Tiempo estimado:</span>
								<span className="text-soft-beige">1-5 minutos</span>
							</div>
						</div>
					</div>

					{/* Important Info */}
					<div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 mb-8">
						<div className="flex items-start gap-3">
							<AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
							<div className="text-left">
								<h3 className="text-yellow-400 font-medium mb-1">Importante</h3>
								<p className="text-soft-beige/80 text-sm">
									No cierres esta página ni actualices el navegador. Te notificaremos por email una vez que se complete el pago.
								</p>
							</div>
						</div>
					</div>

					{/* Common Reasons */}
					<div className="bg-soft-gray/10 rounded-2xl p-6 mb-8 text-left">
						<h3 className="text-soft-beige font-semibold mb-4">¿Por qué puede estar pendiente?</h3>
						<ul className="space-y-2 text-soft-beige/70 text-sm">
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-1">•</span>
								<span>Verificación adicional del banco</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-1">•</span>
								<span>Transferencia bancaria en proceso</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-1">•</span>
								<span>Validación de seguridad del método de pago</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-yellow-400 mt-1">•</span>
								<span>Procesamiento por lotes del banco</span>
							</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/wallet">
							<Button className="bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold px-8 py-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-2xl">
								<RefreshCw className="w-4 h-4 mr-2" />
								Ver Estado del Pago
							</Button>
						</Link>
						
						<Link href="/events">
							<Button className="bg-soft-gray/20 border border-soft-gray/30 text-soft-beige hover:bg-soft-gray/30 px-8 py-3 rounded-2xl transition-all duration-300">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Continuar Navegando
							</Button>
						</Link>
					</div>

					{/* Auto-refresh notice */}
					<div className="mt-8 pt-6 border-t border-soft-gray/20">
						<p className="text-soft-beige/60 text-xs">
							Esta página se actualizará automáticamente cada 30 segundos para verificar el estado del pago.
						</p>
					</div>
				</div>
			</div>
		</main>
	)
} 