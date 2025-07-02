"use client"

import { useEffect, useState } from 'react'
import { AnimatedSection } from '@/app/components/ui/animated-section'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'
import Link from 'next/link'
import type { MembershipTier } from '@prisma/client'

type MembershipCard = {
	name: string
	price: number
	features: string[]
	color: string
	popular: boolean
	borderColor: string
	priority: number
}

const membershipStyles: Record<string, { color: string; borderColor: string; popular: boolean }> = {
	'Puff XXL Estelar': {
		color: 'yellow-500/80',
		borderColor: 'border-yellow-400',
		popular: false,
	},
	'Reposera Deluxe': {
		color: 'from-gray-400 to-gray-500',
		borderColor: 'border-gray-400',
		popular: true,
	},
	'Banquito': {
		color: 'from-orange-700 to-amber-700',
		borderColor: 'border-orange-700',
		popular: false,
	},
}

export default function MembershipTiers() {
	const [memberships, setMemberships] = useState<MembershipCard[]>([])

	useEffect(() => {
		async function fetchMemberships() {
			const res = await fetch('/api/memberships')
			const data = await res.json()
			const arr: MembershipTier[] = Array.isArray(data) ? data : data.memberships

			const mapped = arr.map((m: MembershipTier) => {
				const style = membershipStyles[m.name] || {
					color: 'from-gray-500 to-gray-600',
					borderColor: 'border-gray-500',
					popular: false,
				}
				return {
					name: m.name,
					price: m.price,
					features: m.benefits ? m.benefits.split(',').map((f: string) => f.trim()) : [],
					color: style.color,
					popular: m.name === 'Reposera Deluxe', // Reposera Deluxe es la más popular según el diseño
					borderColor: style.borderColor,
					priority: m.priority,
				}
			})

			// Si hay 3 membresías, coloca la popular en el medio
			if (mapped.length === 3) {
				const popularIdx = mapped.findIndex(m => m.popular)
				if (popularIdx !== 1) {
					const popular = mapped.splice(popularIdx, 1)[0]
					mapped.splice(1, 0, popular)
				}
			}

			setMemberships(mapped)
		}
		fetchMemberships()
	}, [])

	return (
		<section className="py-32 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
			{/* Background Effects */}
			<div className="absolute inset-0">
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<AnimatedSection direction="up" className="text-center mb-20">
					<span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 backdrop-blur-sm border border-orange-400/30 rounded-full text-orange-200 text-sm font-medium mb-6">
						🎭 Únete al Club
					</span>
					<h2 className="font-bebas text-5xl md:text-7xl text-white mb-6 tracking-wide">
						ELIGE TU EXPERIENCIA
					</h2>
					<p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
						Cada membresía está diseñada para ofrecerte beneficios únicos y una experiencia personalizada
					</p>
				</AnimatedSection>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
					{memberships.map((membership, index) => (
						<AnimatedSection
							key={membership.name}
							direction="up"
							delay={index * 200}
						>
							<GlassCard
								variant={membership.name === 'Puff XXL Estelar'
									? 'premium'
									: membership.name === 'Reposera Deluxe'
										? 'default'
										: 'subtle'}
								className={`p-8 relative ${membership.popular ? 'scale-105 z-10' : ''} ${membership.borderColor}`}
							>
								{membership.popular && (
									<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
										<span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
											Más Popular
										</span>
									</div>
								)}

								<div className="text-center mb-8">
									<div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${membership.color} mb-6 shadow-2xl`}>
										<span className="text-white text-2xl font-bold">
											{membership.name[0]}
										</span>
									</div>
									<h3 className="font-bebas text-3xl text-white mb-2 tracking-wide">
										{membership.name}
									</h3>
									<div className="flex items-baseline justify-center mb-6">
										<span className="text-5xl font-bold text-white">
											${membership.price}
										</span>
										<span className="text-gray-400 ml-2">/mes</span>
									</div>
								</div>

								<ul className="space-y-4 mb-8">
									{membership.features.map((feature, featureIndex) => (
										<li key={featureIndex} className="flex items-start">
											<div className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											</div>
											<span className="text-gray-300 leading-relaxed">
												{feature}
											</span>
										</li>
									))}
								</ul>

								<Link href="/auth/signup" className="block">
									<Button
										className={`w-full py-4 text-lg font-semibold ${membership.name === 'Puff XXL Estelar'
											? 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-black'
											: membership.popular
												? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
												: 'bg-white/10 hover:bg-white/20 text-white border-white/30'
											} transform hover:scale-105 transition-all duration-300 shadow-2xl`}
									>
										Seleccionar {membership.name}
									</Button>
								</Link>
							</GlassCard>
						</AnimatedSection>
					))}
				</div>

				<AnimatedSection direction="up" delay={800} className="text-center mt-16">
					<p className="text-gray-400">
						¿Necesitas más información? {' '}
						<Link href="/contact" className="text-orange-400 hover:text-orange-300 transition-colors">
							Contáctanos
						</Link>
					</p>
				</AnimatedSection>
			</div>
		</section>
	)
}
