import { Metadata } from 'next'
import { XCircle, ArrowLeft, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
	title: 'Pago Fallido | Puff & Chill',
	description: 'Hubo un problema con tu pago'
}

export default async function CheckoutFailurePage() {
	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90 flex items-center justify-center">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-3xl p-12">
					{/* Error Icon */}
					<div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full flex items-center justify-center mx-auto mb-8">
						<XCircle className="w-12 h-12 text-red-400" />
					</div>

					{/* Error Message */}
					<h1 className="text-4xl font-bold text-soft-beige mb-4">
						Pago No Procesado
					</h1>
					
					<p className="text-soft-beige/70 text-lg mb-8 leading-relaxed">
						No pudimos procesar tu pago. Esto puede deberse a fondos insuficientes, problemas con el método de pago o un error temporal.
					</p>

					{/* Common Causes */}
					<div className="bg-soft-gray/10 rounded-2xl p-6 mb-8 text-left">
						<h3 className="text-soft-beige font-semibold mb-4">Posibles causas:</h3>
						<ul className="space-y-2 text-soft-beige/70 text-sm">
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-1">•</span>
								<span>Fondos insuficientes en tu cuenta</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-1">•</span>
								<span>Datos de la tarjeta incorrectos</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-1">•</span>
								<span>Límite de compras excedido</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-red-400 mt-1">•</span>
								<span>Problemas temporales con el banco</span>
							</li>
						</ul>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/checkout">
							<Button className="bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold px-8 py-3 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-2xl">
								<RefreshCw className="w-4 h-4 mr-2" />
								Intentar de Nuevo
							</Button>
						</Link>
						
						<Link href="/cart">
							<Button className="bg-soft-gray/20 border border-soft-gray/30 text-soft-beige hover:bg-soft-gray/30 px-8 py-3 rounded-2xl transition-all duration-300">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Volver al Carrito
							</Button>
						</Link>
					</div>

					{/* Support */}
					<div className="mt-8 pt-6 border-t border-soft-gray/20">
						<p className="text-soft-beige/60 text-sm mb-4">
							¿Necesitas ayuda?
						</p>
						<Link href="/support">
							<Button className="bg-transparent border border-soft-gold/30 text-soft-gold hover:bg-soft-gold/10 px-6 py-2 rounded-xl transition-all duration-300 text-sm">
								<MessageCircle className="w-4 h-4 mr-2" />
								Contactar Soporte
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	)
} 