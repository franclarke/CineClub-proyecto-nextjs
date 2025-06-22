import { Suspense } from 'react'
import { CheckCircle, SparklesIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

export default function MembershipPaymentSuccess() {
	return (
		<main className="min-h-screen bg-deep-night/98 backdrop-blur-3xl">
			<section className="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
				<div className="max-w-md w-full">
					<div className="glass-card rounded-2xl p-8 text-center animate-fade-in">
						{/* Success Icon */}
						<div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
							<CheckCircle className="w-12 h-12 text-green-500" />
						</div>

						{/* Success Message */}
						<h1 className="text-3xl font-bold text-soft-beige mb-4">
							¡Upgrade Exitoso!
						</h1>
						
						<p className="text-soft-beige/80 mb-8 leading-relaxed">
							Tu membresía ha sido actualizada exitosamente. Ya puedes disfrutar de todos los beneficios de tu nuevo plan.
						</p>

						{/* Action Buttons */}
						<div className="space-y-4">
							<Link
								href="/profile"
								className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group"
							>
								<SparklesIcon className="w-5 h-5" />
								<span>Ver Mi Perfil</span>
							</Link>
							
							<Link
								href="/events"
								className="w-full flex items-center justify-center space-x-2 bg-soft-gray/20 text-soft-beige px-6 py-4 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group"
							>
								<span>Explorar Eventos</span>
								<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</Link>
						</div>

						{/* Additional Info */}
						<div className="mt-8 p-4 bg-soft-gold/10 border border-soft-gold/20 rounded-xl">
							<p className="text-soft-gold text-sm">
								💡 <strong>Tip:</strong> Revisa tu nueva membresía en tu perfil y descubre todos los beneficios disponibles.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
} 