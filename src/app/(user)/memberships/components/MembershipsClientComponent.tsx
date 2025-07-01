'use client'

import React, { useState } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Check, ArrowRightIcon, SparklesIcon, ShoppingCartIcon, CheckCircle } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'

type UserWithMembership = User & {
	membership: {
		id: string
		name: string
		price: number
		benefits: string[]
		priority: number
	}
}

interface MembershipsClientComponentProps {
	user: UserWithMembership | null
	membershipTiers: MembershipTier[]
	isAuthenticated: boolean
}



export function MembershipsClientComponent({ 
	user, 
	membershipTiers, 
	isAuthenticated 
}: MembershipsClientComponentProps) {
	const router = useRouter()
	const { addProduct, toggleCart } = useCart()
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const handleMembershipAction = async (tier: MembershipTier, action: 'signup' | 'upgrade') => {
		setIsLoading(tier.id)
		
		try {
			if (action === 'signup') {
				router.push(`/?tier=${tier.name}`)
			} else {
				// Crear un producto virtual para la membresía
				const membershipProduct = {
					id: `membership-${tier.id}`,
					name: `Upgrade a Membresía ${tier.name}`,
					description: typeof tier.benefits === 'string' ? tier.benefits : `Actualiza tu membresía a ${tier.name}`,
					price: tier.price,
					stock: 999, // Siempre disponible
					imageUrl: null, // Las membresías no tienen imagen
					createdAt: new Date(),
					updatedAt: new Date()
				}
				
				// Agregar al carrito
				addProduct(membershipProduct, 1)
				
				// Mostrar el carrito
				setTimeout(() => {
					toggleCart()
				}, 500)
			}
		} catch (error) {
			console.error('Error processing membership action:', error)
		} finally {
			setTimeout(() => {
				setIsLoading(null)
			}, 1000)
		}
	}

	const isCurrentTier = (tierName: string) => user?.membership.name === tierName
	const canUpgrade = (tierPriority: number) => 
		user?.membership ? tierPriority < user.membership.priority : true

	return (
		<div className="space-y-8">
			{/* Current Membership Status - Compact */}
			{user && (
				<div className="glass-card rounded-2xl p-6 animate-fade-in">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-xl flex items-center justify-center">
								<SparklesIcon className="w-6 h-6 text-soft-gold" />
							</div>
							<div>
								<h3 className="text-lg font-bold text-soft-beige">Tu Membresía Actual</h3>
								<p className="text-soft-beige/60 text-sm">{user.membership.name} • ${user.membership.price}/mes</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Membership Tiers Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{membershipTiers.map((tier, index) => {
					const isPopular = tier.name === 'Reposera Deluxe' // Reposera Deluxe es la más popular
					const isCurrent = isCurrentTier(tier.name)
					const isUpgrade = canUpgrade(tier.priority)

					// Extraer beneficios del string separado por •
					const benefits = typeof tier.benefits === 'string' 
						? tier.benefits.split('•').map(b => b.trim()).filter(b => b.length > 0)
						: Array.isArray(tier.benefits) 
						? tier.benefits 
						: []

					return (
						<div key={tier.id} className="relative animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
							<div className="relative bg-[#1f140d] rounded-2xl shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl group flex flex-col border border-amber-200/20 hover:border-amber-200/40">
								
								{/* Popular Badge */}
								{isPopular && (
									<div className="absolute top-2 left-2 z-20">
										<span className="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
											Más Popular
										</span>
									</div>
								)}
								
								{/* Current Badge */}
								{isCurrent && (
									<div className="absolute top-2 right-2 z-20">
										<span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
											ACTIVA
										</span>
									</div>
								)}
								

								{/* Image Section with Square Aspect Ratio */}
								<div className="relative aspect-square w-full">
									<Image
										src={tier.imageUrl} 
										alt={`${tier.name} membership`}
										fill
										className="object-cover"
									/>
									{/* Gradient overlay for better integration */}
									<div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1f140d]/90"></div>
									
									{/* Price overlay on image */}
									<div className="absolute bottom-4 left-4 z-10">
										<div className="flex items-baseline">
											<span className="text-3xl font-bold text-white">
												${tier.price}
											</span>
											<span className="text-white/80 ml-1 text-base">/mes</span>
										</div>
									</div>
								</div>

								{/* Content Section */}
								<div className="p-4 md:p-6 space-y-4 flex-1 flex flex-col">
									{/* Title */}
									<div className="text-center">
										<h3 className="text-xl font-semibold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300">
											{tier.name}
										</h3>
										{tier.description && (
											<p className="text-sm text-gray-400 leading-snug">
												{tier.description}
											</p>
										)}
									</div>

									{/* Benefits List */}
									<ul className="space-y-1 flex-1">
										{benefits.map((benefit, benefitIndex) => (
											<li key={benefitIndex} className="flex items-start gap-2 leading-snug">
												<CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
												<span className="text-sm text-gray-300">
													{benefit}
												</span>
											</li>
										))}
									</ul>

									{/* Action Button - At bottom */}
									<div className="mt-auto pt-4">
										{isCurrent ? (
											<div className="bg-yellow-400/20 text-yellow-400 px-4 py-3 rounded-xl text-center font-semibold text-sm border border-yellow-400/30">
												<div className="flex items-center justify-center space-x-2">
													<CheckCircle className="w-4 h-4" />
													<span>Membresía Actual</span>
												</div>
											</div>
										) : !isAuthenticated ? (
											<button
												onClick={() => handleMembershipAction(tier, 'signup')}
												disabled={isLoading === tier.id}
												className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
											>
												{isLoading === tier.id ? (
													<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
												) : (
													<>
														<span>Registrarse</span>
														<ArrowRightIcon className="w-4 h-4" />
													</>
												)}
											</button>
										) : isUpgrade ? (
											<button
												onClick={() => handleMembershipAction(tier, 'upgrade')}
												disabled={isLoading === tier.id}
												className="w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 hover:scale-[1.02] transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
											>
												{isLoading === tier.id ? (
													<>
														<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
														<span>Agregando...</span>
													</>
												) : (
													<>
														<ShoppingCartIcon className="w-4 h-4" />
														<span>Agregar al Carrito</span>
													</>
												)}
											</button>
										) : (
											<div className="bg-gray-800/50 text-gray-500 px-4 py-3 rounded-xl text-center font-semibold text-sm border border-gray-700">
												No disponible
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Features Comparison Table - Compact */}
			<div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
				<h2 className="text-2xl font-bold text-soft-beige text-center mb-6">
					Comparación de Beneficios
				</h2>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-soft-beige/20">
								<th className="text-left py-4 text-soft-beige font-semibold">Beneficio</th>
								{membershipTiers.map(tier => (
									<th key={tier.id} className="text-center py-4 text-soft-beige font-semibold">
										{tier.name}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{[
								'Acceso a eventos',
								'Reserva anticipada',
								'Descuentos especiales',
								'Bebida gratis',
								'Asientos premium',
								'Eventos exclusivos'
							].map((feature, index) => (
								<tr key={index} className="border-b border-soft-beige/10 hover:bg-soft-gray/10 transition-colors duration-200">
									<td className="py-3 text-soft-beige/90 font-medium text-sm">{feature}</td>
									{membershipTiers.map(tier => (
										<td key={tier.id} className="text-center py-3">
											{(Array.isArray(tier.benefits) 
												? tier.benefits 
												: tier.benefits?.split(',') || []
											).some(benefit => 
												benefit.toLowerCase().includes(feature.toLowerCase().split(' ')[0])
											) ? (
												<div className="w-6 h-6 bg-soft-gold/20 rounded-full flex items-center justify-center mx-auto">
													<Check className="w-4 h-4 text-soft-gold" />
												</div>
											) : (
												<span className="text-soft-beige/30 text-lg">-</span>
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
} 
