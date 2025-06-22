'use client'

import { MembershipTier } from '@prisma/client'

interface MembershipSelectorProps {
	memberships: MembershipTier[]
	selectedId?: string
	onSelect: (id: string) => void
	error?: string
}

const tierIcons = {
	Bronze: '🥉',
	Silver: '🥈', 
	Gold: '🥇'
}

const tierGradients = {
	Bronze: 'from-orange-400 to-amber-600',
	Silver: 'from-gray-300 to-gray-500',
	Gold: 'from-yellow-400 to-yellow-600'
}

export function MembershipSelector({
	memberships,
	selectedId,
	onSelect,
	error,
}: MembershipSelectorProps) {
	return (
		<div className="space-y-6">
			<div className="grid gap-6 md:grid-cols-3">
				{memberships.map((membership) => {
					const isSelected = selectedId === membership.id
					const tierIcon = tierIcons[membership.name as keyof typeof tierIcons] || '🎭'
					const tierGradient = tierGradients[membership.name as keyof typeof tierGradients] || 'from-orange-400 to-amber-600'
					
					return (
						<div
							key={membership.id}
							onClick={() => onSelect(membership.id)}
							className={`group relative overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 ${
								isSelected ? 'scale-105' : ''
							}`}
						>
							{/* Background with glassmorphism */}
							<div className={`relative p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
								isSelected
									? 'bg-white/20 border-orange-400 shadow-2xl shadow-orange-500/25'
									: 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
							}`}>
								{/* Floating background effect */}
								<div className={`absolute inset-0 bg-gradient-to-br ${tierGradient} opacity-5 rounded-2xl`} />
								
								{/* Content */}
								<div className="relative z-10 text-center">
									{/* Icon and Badge */}
									<div className="mb-6">
										<div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
											isSelected 
												? `bg-gradient-to-br ${tierGradient} shadow-lg`
												: 'bg-white/10'
										}`}>
											<span className="text-2xl">{tierIcon}</span>
										</div>
										
										{membership.name === 'Silver' && (
											<div className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
												MÁS POPULAR
											</div>
										)}
									</div>

									{/* Tier Name */}
									<h4 className={`text-2xl font-bold mb-3 ${
										isSelected ? 'text-white' : 'text-gray-100'
									}`}>
										{membership.name}
									</h4>

									{/* Price */}
									<div className="mb-6">
										<span className={`text-4xl font-bold ${
											isSelected ? 'text-orange-300' : 'text-orange-400'
										}`}>
											${membership.price}
										</span>
										<span className="text-gray-400 text-sm">/mes</span>
									</div>

									{/* Description */}
									{membership.description && (
										<p className="text-gray-300 text-sm mb-6 leading-relaxed">
											{membership.description}
										</p>
									)}

									{/* Benefits */}
									{membership.benefits && (
										<div className="space-y-2">
											{membership.benefits.split(',').map((benefit, index) => (
												<div key={index} className="flex items-center text-sm text-gray-300">
													<svg className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
														<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
													</svg>
													<span>{benefit.trim()}</span>
												</div>
											))}
										</div>
									)}
								</div>

								{/* Selection Indicator */}
								{isSelected && (
									<div className="absolute top-4 right-4">
										<div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
											<svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
												<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
											</svg>
										</div>
									</div>
								)}

								{/* Hover glow effect */}
								<div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
									isSelected 
										? 'opacity-20' 
										: 'opacity-0 group-hover:opacity-10'
								} bg-gradient-to-br ${tierGradient}`} />
							</div>

							{/* Premium badge for Gold */}
							{membership.name === 'Gold' && (
								<div className="absolute -top-2 -right-2">
									<div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
										PREMIUM
									</div>
								</div>
							)}
						</div>
					)
				})}
			</div>

			{/* Error Display */}
			{error && (
				<div className="relative">
					<div className="absolute inset-0 bg-red-500/20 rounded-lg blur-sm"></div>
					<div className="relative p-4 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
						<div className="flex items-center space-x-2">
							<svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							<p className="text-sm text-red-300 font-medium">{error}</p>
						</div>
					</div>
				</div>
			)}
		</div>
	)
} 
