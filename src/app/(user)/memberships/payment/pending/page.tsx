import { Clock, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function MembershipPaymentPending() {
	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			<section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full">
					<div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
						{/* Pending Icon */}
						<div className="w-20 h-20 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
							<Clock className="w-12 h-12 text-yellow-500" />
						</div>

						{/* Pending Message */}
						<h1 className="text-3xl font-bold text-soft-beige mb-4">
							Pago Pendiente
						</h1>
						
						<p className="text-soft-beige/80 mb-8 leading-relaxed">
							Tu pago está siendo procesado. Te notificaremos por email cuando se complete la actualización de tu membresía.
						</p>

						{/* Action Buttons */}
						<div className="space-y-4">
							<Link
								href="/profile"
								className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
							>
								<span>Ver Mi Perfil</span>
								<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Link>
							
							<Link
								href="/events"
								className="w-full flex items-center justify-center space-x-2 bg-soft-gray/20 text-soft-beige px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group"
							>
								<span>Explorar Eventos</span>
								<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Link>
						</div>

						{/* Info Notice */}
						<div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
							<p className="text-yellow-400 text-sm">
								⏳ <strong>Procesando:</strong> El procesamiento puede tomar hasta 5 minutos. Recibirás una confirmación por email.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
} 