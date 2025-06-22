import { Suspense } from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CheckCircle, Ticket, Package, Calendar, MapPin, ArrowRight, Download, Mail, Sparkles, ShoppingBag, Home, Loader2 } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Pago Exitoso | Puff & Chill',
	description: 'Tu pago se ha procesado correctamente'
}

interface SearchParams {
	order_id?: string
	payment_id?: string
	status?: string
}

export default async function CheckoutSuccessPage({
	searchParams
}: {
	searchParams: Promise<SearchParams>
}) {
	const params = await searchParams
	const orderId = params.order_id

	return (
		<main className="min-h-screen bg-gradient-to-br from-deep-night via-deep-night/95 to-deep-night/90 flex items-center justify-center px-4">
			<div className="max-w-lg w-full">
				{/* Success Animation */}
				<div className="text-center mb-8">
					<div className="relative inline-flex">
						{/* Background glow */}
						<div className="absolute inset-0 bg-soft-gold/30 blur-3xl animate-pulse"></div>
						
						{/* Success icon */}
						<div className="relative w-24 h-24 bg-gradient-to-r from-soft-gold to-sunset-orange rounded-full flex items-center justify-center mx-auto animate-scale-in">
							<CheckCircle className="w-12 h-12 text-deep-night" />
						</div>
					</div>
				</div>

				{/* Content */}
				<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-3xl p-8 text-center space-y-6">
					<div className="space-y-3">
						<h1 className="text-3xl font-bold text-soft-beige">
							¡Pago Exitoso!
						</h1>
						<p className="text-soft-beige/70 text-lg">
							Tu compra ha sido procesada correctamente
						</p>
					</div>

					{orderId && (
						<div className="bg-soft-gold/10 border border-soft-gold/20 rounded-xl p-4">
							<p className="text-soft-beige/60 text-sm mb-1">Número de orden</p>
							<p className="text-soft-gold font-mono font-bold text-lg">#{orderId.slice(-8).toUpperCase()}</p>
						</div>
					)}

					{/* Next steps */}
					<div className="space-y-4 text-left">
						<h3 className="font-semibold text-soft-beige flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-soft-gold" />
							Próximos pasos:
						</h3>
						<div className="space-y-3 text-soft-beige/60 text-sm">
							<div className="flex items-start gap-3">
								<Mail className="w-5 h-5 text-soft-gold/60 flex-shrink-0 mt-0.5" />
								<p>Recibirás un email con los detalles de tu compra y el comprobante de pago</p>
							</div>
							<div className="flex items-start gap-3">
								<Download className="w-5 h-5 text-soft-gold/60 flex-shrink-0 mt-0.5" />
								<p>Puedes descargar tus tickets desde tu wallet personal</p>
							</div>
							<div className="flex items-start gap-3">
								<ShoppingBag className="w-5 h-5 text-soft-gold/60 flex-shrink-0 mt-0.5" />
								<p>Los productos los puedes retirar el día del evento en nuestro kiosko</p>
							</div>
						</div>
					</div>

					{/* Actions */}
					<div className="flex flex-col sm:flex-row gap-3 pt-4">
						<Link href="/wallet" className="flex-1">
							<Button className="w-full bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night font-bold hover:shadow-xl hover:scale-[1.02] transition-all duration-300 rounded-2xl">
								<Download className="w-4 h-4 mr-2" />
								Ver Mis Tickets
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</Link>
						
						<Link href="/" className="flex-1">
							<Button className="w-full bg-soft-gray/20 border border-soft-gray/30 text-soft-beige hover:bg-soft-gray/30 rounded-2xl transition-all duration-300">
								<Home className="w-4 h-4 mr-2" />
								Volver al Inicio
							</Button>
						</Link>
					</div>

					{/* Animation element */}
					<div className="flex justify-center gap-2 pt-4">
						<div className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
						<div className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
						<div className="w-2 h-2 bg-soft-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
					</div>
				</div>

				{/* Decorative elements */}
				<div className="absolute top-20 left-10 w-32 h-32 bg-soft-gold/10 rounded-full blur-3xl animate-float"></div>
				<div className="absolute bottom-20 right-10 w-40 h-40 bg-sunset-orange/10 rounded-full blur-3xl animate-float-delayed"></div>
			</div>
		</main>
	)
} 