'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import { AnimatedSection } from '../ui/animated-section'

export function HeroSection() {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const handleScroll = () => setScrollY(window.scrollY)
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [])

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image with Parallax */}
			<div 
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: 'url(/background-image.png)',
					transform: `translateY(${scrollY * 0.5}px)`,
					scale: '1.1'
				}}
			/>
			
			{/* Dark Overlay with Gradient */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
			
			{/* Content */}
			<div className="relative z-10 text-center px-4 max-w-6xl mx-auto">

				<AnimatedSection direction="up" delay={400}>
					<h1 className="font-bebas text-7xl md:text-9xl lg:text-[10rem] text-white mb-6 leading-none tracking-wider">
						PUFF<span className="text-orange-400">&</span>CHILL
					</h1>
				</AnimatedSection>

				<AnimatedSection direction="up" delay={600}>
					<p className="text-xl md:text-2xl text-gray-200 mb-4 font-light">
						Cine Silencioso Bajo las Estrellas
					</p>
					<p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
						Descubre una nueva forma de disfrutar el cine en un ambiente mágico, 
						donde las películas cobran vida bajo un cielo estrellado
					</p>
				</AnimatedSection>

				<AnimatedSection direction="up" delay={800}>
					<div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
						<Link href="/auth/signup">
							<Button 
								size="lg" 
								className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white border-0 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-105 transition-all duration-300"
							>
								Únete al Club
							</Button>
						</Link>
						<Link href="/events">
							<Button 
								variant="outline" 
								size="lg"
								className="px-12 py-4 text-lg font-semibold bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300"
							>
								Ver Eventos
							</Button>
						</Link>
					</div>
				</AnimatedSection>

			</div>
		</section>
	)
} 