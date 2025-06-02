import Link from 'next/link'
import { AnimatedSection } from '../ui/animated-section'
import { Button } from '../ui/button'

export function CTASection() {
	return (
		<section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-600/20 via-orange-600/5 to-transparent" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<AnimatedSection direction="up" className="text-center max-w-4xl mx-auto">
					<span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-orange-200 text-sm font-medium mb-8">
						🚀 Comienza Tu Aventura
					</span>
					
					<h2 className="font-bebas text-6xl md:text-8xl text-white mb-8 tracking-wide leading-none">
						¿LISTO PARA LA
						<span className="block text-transparent bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text">
							EXPERIENCIA?
						</span>
					</h2>
					
					<p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
						Únete a nuestra comunidad exclusiva y descubre por qué somos más que un cine. 
						Somos una experiencia que cambiará tu perspectiva del entretenimiento.
					</p>

					<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
						<Link href="/auth/signup">
							<Button 
								size="lg" 
								className="px-16 py-6 text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-2xl hover:shadow-orange-500/50 transform hover:scale-110 transition-all duration-500 relative overflow-hidden group"
							>
								<span className="relative z-10">Únete Ahora</span>
								<div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</Button>
						</Link>
						<Link href="/events">
							<Button 
								variant="outline" 
								size="lg"
								className="px-16 py-6 text-xl font-bold bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 shadow-2xl transform hover:scale-110 transition-all duration-500"
							>
								Ver Próximos Eventos
							</Button>
						</Link>
					</div>

					{/* Stats */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<AnimatedSection direction="up" delay={200}>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-white mb-2">
									500+
								</div>
								<div className="text-gray-400">
									Miembros Activos
								</div>
							</div>
						</AnimatedSection>
						<AnimatedSection direction="up" delay={400}>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-white mb-2">
									150+
								</div>
								<div className="text-gray-400">
									Películas Proyectadas
								</div>
							</div>
						</AnimatedSection>
						<AnimatedSection direction="up" delay={600}>
							<div className="text-center">
								<div className="text-4xl md:text-5xl font-bold text-white mb-2">
									98%
								</div>
								<div className="text-gray-400">
									Satisfacción de Clientes
								</div>
							</div>
						</AnimatedSection>
					</div>
				</AnimatedSection>
			</div>

			{/* Floating elements */}
			<div className="absolute top-1/4 left-10 w-20 h-20 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
			<div className="absolute bottom-1/4 right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
		</section>
	)
} 