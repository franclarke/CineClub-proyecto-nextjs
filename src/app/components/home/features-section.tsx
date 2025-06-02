import { AnimatedSection } from '../ui/animated-section'
import { GlassCard } from '../ui/glass-card'

const features = [
	{
		icon: '🎧',
		title: 'Audio Silencioso',
		description: 'Tecnología de última generación que te permite disfrutar del audio perfecto sin molestar a otros.',
		accent: 'from-blue-500 to-purple-600'
	},
	{
		icon: '⭐',
		title: 'Bajo las Estrellas',
		description: 'Una experiencia única al aire libre donde el cielo nocturno es parte del espectáculo.',
		accent: 'from-amber-500 to-orange-600'
	},
	{
		icon: '🛋️',
		title: 'Comodidad Premium',
		description: 'Asientos y espacios diseñados para tu máximo confort durante toda la función.',
		accent: 'from-emerald-500 to-teal-600'
	},
	{
		icon: '🍿',
		title: 'Gastronomía Gourmet',
		description: 'Selección curada de snacks artesanales y bebidas premium para acompañar tu experiencia.',
		accent: 'from-rose-500 to-pink-600'
	},
	{
		icon: '👥',
		title: 'Comunidad Exclusiva',
		description: 'Forma parte de un club selecto de amantes del cine con eventos y beneficios únicos.',
		accent: 'from-violet-500 to-purple-600'
	},
	{
		icon: '🎬',
		title: 'Cine de Autor',
		description: 'Cuidadosa selección de películas que van desde clásicos hasta estrenos independientes.',
		accent: 'from-cyan-500 to-blue-600'
	}
]

export function FeaturesSection() {
	return (
		<section className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
			
			<div className="container mx-auto px-4">
				<AnimatedSection direction="up" className="text-center mb-20">
					<span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-orange-200 text-sm font-medium mb-6">
						✨ Experiencia Completa
					</span>
					<h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide">
						MÁS QUE CINE
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Cada detalle ha sido diseñado para crear momentos inolvidables que van más allá de ver una película
					</p>
				</AnimatedSection>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<AnimatedSection 
							key={feature.title}
							direction="up" 
							delay={index * 100}
						>
							<GlassCard className="p-8 h-full group">
								<div className="text-center">
									<div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.accent} mb-6 text-2xl group-hover:scale-110 transition-transform duration-300`}>
										{feature.icon}
									</div>
									<h3 className="font-bebas text-2xl text-white mb-4 tracking-wide">
										{feature.title}
									</h3>
									<p className="text-gray-300 leading-relaxed">
										{feature.description}
									</p>
								</div>
							</GlassCard>
						</AnimatedSection>
					))}
				</div>
			</div>
		</section>
	)
} 