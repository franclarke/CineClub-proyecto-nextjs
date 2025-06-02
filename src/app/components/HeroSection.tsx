'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function HeroSection() {
	const [isVisible, setIsVisible] = useState(false)

	useEffect(() => {
		setIsVisible(true)
	}, [])

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src="/background-image.png"
					alt="Cine silencioso bajo las estrellas"
					fill
					className="object-cover"
					priority
					quality={90}
				/>
				{/* Dark overlay for text readability */}
				<div className="absolute inset-0 bg-gradient-to-b from-deep-night/70 via-deep-night/50 to-deep-night/80"></div>
			</div>

			{/* Content */}
			<div className={`relative z-10 text-center px-4 max-w-6xl mx-auto transition-all duration-1000 ${
				isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
			}`}>
				{/* Main Title */}
				<h1 className="text-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-soft-beige mb-6 drop-shadow-2xl leading-tight">
					PUFF & CHILL
				</h1>

				{/* Subtitle */}
				<p className="text-xl sm:text-2xl md:text-3xl text-soft-beige/90 mb-4 font-light drop-shadow-lg">
					Sesiones de Cine Silencioso Bajo las Estrellas
				</p>

				{/* Description */}
				<p className="text-lg sm:text-xl text-soft-beige/80 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
					Vive el cine como nunca antes en nuestra exclusiva terraza. 
					Sonido premium a través de auriculares inalámbricos, snacks gourmet y vistas impresionantes de la ciudad.
				</p>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
					<button className="btn-primary px-10 py-4 rounded-xl text-lg font-semibold shadow-glow hover:scale-105 transition-all duration-300 w-full sm:w-auto">
						Reserva tu Asiento Esta Noche
					</button>
					<button className="btn-premium px-10 py-4 rounded-xl text-lg font-semibold hover:scale-105 transition-all duration-300 w-full sm:w-auto">
						Explorar Membresía Gold
					</button>
				</div>

			</div>

			{/* Floating music note animation */}
			<div className="absolute top-1/4 right-1/4 animate-pulse">
				<span className="text-4xl text-soft-gold/30">🎵</span>
			</div>
			<div className="absolute bottom-1/3 left-1/4 animate-pulse" style={{ animationDelay: '1s' }}>
				<span className="text-3xl text-sunset-orange/30">🎶</span>
			</div>
		</section>
	)
} 