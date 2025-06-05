'use client'

import { AnimatedSection } from '../ui/animated-section'

export function HeroSection() {
	return (
		<section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
			{/* Content */}
			<div className="relative z-10 px-4 text-center">
				<AnimatedSection direction="up" delay={400}>
					<h1 className="font-bebas text-5xl text-white md:text-7xl lg:text-8xl">
						PUFF<span className="text-orange-400">&</span>CHILL
					</h1>
				</AnimatedSection>

				<AnimatedSection direction="up" delay={600}>
					<p className="mb-4 text-xl text-gray-200 md:text-2xl">
						Cine Silencioso Bajo las Estrellas
					</p>
					<p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-300">
						Descubre una nueva forma de disfrutar el cine en un ambiente mágico,
						donde las películas cobran vida bajo un cielo estrellado
					</p>
				</AnimatedSection>
			</div>
		</section>
	)
} 