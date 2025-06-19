'use client'

import React, { useState } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Button } from '../../../components/ui/button'
import { GlassCard } from '../../../components/ui/glass-card'
import { Star, Check, Crown, Shield, Award, ArrowRightIcon, SparklesIcon } from 'lucide-react'

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
	suggestedUpgrade?: string
	isAuthenticated: boolean
}

const tierIcons = {
	'Bronze': Shield,
	'Silver': Award,
	'Gold': Crown
}

const tierColors = {
	'Bronze': {
		bg: 'from-orange-600/20 to-amber-600/20',
		border: 'border-orange-500/50',
		accent: 'text-orange-400',
		gradient: 'from-orange-500/20 to-orange-500/5'
	},
	'Silver': {
		bg: 'from-gray-400/20 to-gray-500/20',
		border: 'border-gray-400/50',
		accent: 'text-gray-300',
		gradient: 'from-gray-400/20 to-gray-400/5'
	},
	'Gold': {
		bg: 'from-yellow-500/20 to-amber-500/20',
		border: 'border-yellow-400/50',
		accent: 'text-yellow-400',
		gradient: 'from-yellow-500/20 to-yellow-500/5'
	}
}

export function MembershipsClientComponent({ 
	user, 
	membershipTiers, 
	suggestedUpgrade,
	isAuthenticated 
}: MembershipsClientComponentProps) {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState<string | null>(null)

	const handleMembershipAction = async (tierName: string, action: 'signup' | 'upgrade') => {
		setIsLoading(tierName)
		
		try {
			if (action === 'signup') {
				router.push(`/?tier=${tierName}`)
			} else {
				const response = await fetch('/api/memberships/upgrade', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ tierName })
				})

				if (response.ok) {
					const { paymentUrl } = await response.json()
					window.location.href = paymentUrl
				}
			}
		} catch (error) {
			console.error('Error processing membership action:', error)
		} finally {
			setIsLoading(null)
		}
	}

	const isCurrentTier = (tierName: string) => user?.membership.name === tierName
	const canUpgrade = (tierPriority: number) => 
		user?.membership ? tierPriority > user.membership.priority : true

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
						<div className="bg-soft-gold/20 text-soft-gold px-4 py-2 rounded-full text-sm font-bold border border-soft-gold/30">
							ACTIVA
						</div>
					</div>
				</div>
			)}

			{/* Membership Tiers Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{membershipTiers.map((tier, index) => {
					const Icon = tierIcons[tier.name as keyof typeof tierIcons] || Shield
					const colors = tierColors[tier.name as keyof typeof tierColors] || tierColors.Bronze
					const isPopular = tier.name === 'Silver'
					const isCurrent = isCurrentTier(tier.name)
					const isUpgrade = canUpgrade(tier.priority)
					const isSuggested = suggestedUpgrade === tier.name

					return (
						<div key={tier.id} className="relative animate-fade-in hover-lift" style={{ animationDelay: `${index * 0.1}s` }}>
							{(isPopular || isSuggested) && (
								<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
									<span className="bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-4 py-1 rounded-full text-xs font-bold shadow-lg">
										{isSuggested ? 'Recomendado' : 'Más Popular'}
									</span>
								</div>
							)}

							<div className={`
								glass-card rounded-2xl p-6 h-full relative transition-all duration-300
								${isCurrent ? 'ring-2 ring-soft-gold/50 shadow-[0_20px_40px_-12px_rgba(255,199,87,0.2)]' : ''}
								${isPopular || isSuggested ? 'scale-[1.02]' : ''}
								group
							`}>
								{isCurrent && (
									<div className="absolute top-4 right-4">
										<div className="bg-soft-gold text-deep-night px-3 py-1 rounded-full text-xs font-bold">
											ACTIVA
										</div>
									</div>
								)}

								<div className="space-y-6">
									{/* Header */}
									<div className="text-center">
										<div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${colors.bg} border ${colors.border} mb-4 group-hover:scale-110 transition-transform duration-300`}>
											<Icon className={`w-8 h-8 ${colors.accent}`} />
										</div>
										<h3 className="text-2xl font-bold text-soft-beige mb-2 group-hover:text-sunset-orange transition-colors duration-300">
											{tier.name}
										</h3>
										<div className="flex items-baseline justify-center mb-4">
											<span className="text-3xl font-bold text-soft-beige">
												${tier.price}
											</span>
											<span className="text-soft-beige/60 ml-1 text-base">/mes</span>
										</div>
									</div>

									{/* Benefits */}
									<ul className="space-y-3">
										{(Array.isArray(tier.benefits) 
											? tier.benefits 
											: tier.benefits?.split(',') || []
										).map((benefit, index) => (
											<li key={index} className="flex items-start gap-3">
												<div className="w-5 h-5 bg-soft-gold/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
													<Check className="w-3 h-3 text-soft-gold" />
												</div>
												<span className="text-soft-beige/90 text-sm leading-relaxed">
													{benefit.trim()}
												</span>
											</li>
										))}
									</ul>

									{/* Action Button */}
									<div className="pt-4">
										{isCurrent ? (
											<div className="bg-soft-gold/20 text-soft-gold px-4 py-3 rounded-xl text-center font-semibold text-sm">
												<div className="flex items-center justify-center space-x-2">
													<Check className="w-4 h-4" />
													<span>Membresía Actual</span>
												</div>
											</div>
										) : !isAuthenticated ? (
											<button
												onClick={() => handleMembershipAction(tier.name, 'signup')}
												disabled={isLoading === tier.name}
												className={`
													w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg
													${isPopular || isSuggested 
														? 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night hover:shadow-xl' 
														: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20'
													}
													flex items-center justify-center space-x-2 group hover:scale-[1.02]
												`}
											>
												{isLoading === tier.name ? (
													<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
												) : (
													<>
														<span>Registrarse con {tier.name}</span>
														<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
													</>
												)}
											</button>
										) : isUpgrade ? (
											<button
												onClick={() => handleMembershipAction(tier.name, 'upgrade')}
												disabled={isLoading === tier.name}
												className={`
													w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg
													${isPopular || isSuggested 
														? 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night hover:shadow-xl' 
														: 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20'
													}
													flex items-center justify-center space-x-2 group hover:scale-[1.02]
												`}
											>
												{isLoading === tier.name ? (
													<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
												) : (
													<>
														<span>Upgrade a {tier.name}</span>
														<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
													</>
												)}
											</button>
										) : (
											<div className="bg-soft-gray/20 text-soft-gray px-4 py-3 rounded-xl text-center font-semibold text-sm">
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