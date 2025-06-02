'use client'

import { useState } from 'react'
import { AnimatedSection } from '../ui/animated-section'
import { GlassCard } from '../ui/glass-card'

const experiences = [
	{
		id: 1,
		title: 'La Noche del Cine',
		description: 'Cuando el sol se oculta, comienza la magia. Nuestro espacio se transforma en un santuario cinematográfico donde cada detalle está diseñado para transportarte.',
		highlights: ['Pantalla de 50 pies', 'Audio HD inalámbrico', 'Ambiente controlado'],
		image: '🌙'
	},
	{
		id: 2,
		title: 'Tecnología Inmersiva',
		description: 'Sistema de audio silencioso de última generación que permite a cada espectador controlar su experiencia sonora sin interferir con otros.',
		highlights: ['Audio personalizable', 'Cancelación de ruido', 'Calidad studio'],
		image: '🎧'
	},
	{
		id: 3,
		title: 'Gastronomía Artesanal',
		description: 'Selección curada de snacks gourmet y bebidas artesanales que complementan perfectamente cada género cinematográfico.',
		highlights: ['Ingredientes premium', 'Maridajes únicos', 'Preparación en vivo'],
		image: '🍿'
	}
]

export function ExperienceSection() {
	const [activeExperience, setActiveExperience] = useState(0)

	return (
		<section className="py-32 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
			{/* Animated Background */}
			<div className="absolute inset-0">
				<div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />
				<div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<AnimatedSection direction="up" className="text-center mb-20">
					<span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-orange-200 text-sm font-medium mb-6">
						🎭 La Experiencia
					</span>
					<h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide">
						MOMENTOS ÚNICOS
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Cada sesión es cuidadosamente diseñada para crear recuerdos que durarán toda la vida
					</p>
				</AnimatedSection>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
					{/* Interactive Cards */}
					<div className="space-y-6">
						{experiences.map((experience, index) => (
							<AnimatedSection 
								key={experience.id}
								direction="left" 
								delay={index * 200}
							>
								<div 
									className={`p-8 cursor-pointer transition-all duration-500 backdrop-blur-xl border rounded-2xl ${
										activeExperience === index 
											? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-400/50 scale-105 shadow-2xl' 
											: 'bg-white/10 border-white/20 hover:bg-white/5 shadow-2xl'
									}`}
									onClick={() => setActiveExperience(index)}
								>
									<div className="flex items-start space-x-6">
										<div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
											activeExperience === index 
												? 'bg-gradient-to-r from-orange-500 to-amber-500 scale-110' 
												: 'bg-gray-700'
										}`}>
											{experience.image}
										</div>
										<div className="flex-1">
											<h3 className="font-bebas text-2xl text-white mb-3 tracking-wide">
												{experience.title}
											</h3>
											<p className="text-gray-300 leading-relaxed mb-4">
												{experience.description}
											</p>
											<div className="flex flex-wrap gap-2">
												{experience.highlights.map((highlight, highlightIndex) => (
													<span 
														key={highlightIndex}
														className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-full"
													>
														{highlight}
													</span>
												))}
											</div>
										</div>
									</div>
								</div>
							</AnimatedSection>
						))}
					</div>

					{/* Visual Showcase */}
					<AnimatedSection direction="right" delay={400}>
						<GlassCard className="p-12 text-center">
							<div className="space-y-8">
								<div className="text-8xl">
									{experiences[activeExperience].image}
								</div>
								<div>
									<h3 className="font-bebas text-3xl text-white mb-4 tracking-wide">
										{experiences[activeExperience].title}
									</h3>
									<p className="text-lg text-gray-300 leading-relaxed">
										{experiences[activeExperience].description}
									</p>
								</div>
								<div className="grid grid-cols-3 gap-4 pt-8">
									{experiences[activeExperience].highlights.map((highlight, index) => (
										<div key={index} className="text-center">
											<div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mx-auto mb-2 flex items-center justify-center">
												<span className="text-white font-bold text-lg">
													{index + 1}
												</span>
											</div>
											<p className="text-sm text-gray-300">
												{highlight}
											</p>
										</div>
									))}
								</div>
							</div>
						</GlassCard>
					</AnimatedSection>
				</div>
			</div>
		</section>
	)
} 