import { XCircle, ArrowRightIcon, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function MembershipPaymentFailure() {
	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			<section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full">
					<div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
						{/* Failure Icon */}
						<div className="w-20 h-20 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
							<XCircle className="w-12 h-12 text-red-500" />
						</div>

						{/* Failure Message */}
						<h1 className="text-3xl font-bold text-soft-beige mb-4">
							Pago No Completado
						</h1>
						
						<p className="text-soft-beige/80 mb-8 leading-relaxed">
							No pudimos procesar tu pago en este momento. Tu membresía actual se mantiene sin cambios.
						</p>

						{/* Action Buttons */}
						<div className="space-y-4">
							<Link
								href="/memberships"
								className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
							>
								<RefreshCw className="w-5 h-5" />
								<span>Intentar Nuevamente</span>
							</Link>
							
							<Link
								href="/profile"
								className="w-full flex items-center justify-center space-x-2 bg-soft-gray/20 text-soft-beige px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group"
							>
								<span>Volver a Mi Perfil</span>
								<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Link>
						</div>

						{/* Help Info */}
						<div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
							<p className="text-red-400 text-sm">
								💬 <strong>¿Necesitas ayuda?</strong> Si el problema persiste, contacta a nuestro equipo de soporte.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
} 