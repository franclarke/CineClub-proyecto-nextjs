'use client'

import { MembershipTier } from '@prisma/client'
import Image from 'next/image'

interface MembershipSelectorProps {
	memberships: MembershipTier[]
	selectedId?: string
	onSelect: (id: string) => void
	error?: string
}

const tierBadges = {
	'Banquito': null,
	'Reposera Deluxe': { text: 'MÁS POPULAR', color: 'bg-orange-500' },
	'Puff XXL Estelar': { text: 'PREMIUM', color: 'bg-yellow-500' }
}

const tierColors = {
	'Banquito': 'border-amber-500/20 hover:border-amber-500/40',
	'Reposera Deluxe': 'border-orange-500/30 hover:border-orange-500/50',
	'Puff XXL Estelar': 'border-yellow-500/30 hover:border-yellow-500/50'
}

export function MembershipSelector({
	memberships,
	selectedId,
	onSelect,
	error,
}: MembershipSelectorProps) {
	return (
		<div className="space-y-4">
			{/* Layout vertical: 1 columna × 3 filas */}
			<div className="space-y-3">
				{memberships.map((membership) => {
					const isSelected = selectedId === membership.id
					const tierBadge = tierBadges[membership.name as keyof typeof tierBadges]
					const tierColor = tierColors[membership.name as keyof typeof tierColors]
					
					return (
						<div
							key={membership.id}
							onClick={() => onSelect(membership.id)}
							className={`
								relative cursor-pointer transition-all duration-200 
								${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
							`}
						>
							{/* Contenedor principal minimalista */}
							<div className={`
								relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-200
								${isSelected 
									? 'bg-white/15 border-orange-400 shadow-lg shadow-orange-500/20' 
									: `bg-white/5 ${tierColor}`
								}
							`}>
								{/* Layout horizontal compacto */}
								<div className="flex items-center justify-between">
									{/* Lado izquierdo: Icono + Info */}
									<div className="flex items-center space-x-3">
										{/* Icono optimizado para mejor visualización */}
										<div className={`
											flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all
											${isSelected 
												? 'bg-orange-400/30 ring-1 ring-orange-400/50' 
												: 'bg-white/10 hover:bg-white/15'
											}
										`}>
											{membership.imageUrl ? (
												<Image
													src={membership.imageUrl}
													alt={membership.name}
													width={32}
													height={32}
													className="w-12 h-12 object-contain filter brightness-110 contrast-110 rounded-lg"
												/>
											) : (
												<span className="text-xl">🎭</span>
											)}
										</div>

										{/* Información principal */}
										<div className="min-w-0 flex-1">
											{/* Nombre del plan */}
											<h4 className={`
												text-base font-semibold truncate
												${isSelected ? 'text-white' : 'text-gray-100'}
											`}>
												{membership.name}
											</h4>
											
											{/* Indicador breve (badge) */}
											{tierBadge && (
												<div className={`
													inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
													${tierBadge.color} text-white
												`}>
													{tierBadge.text}
												</div>
											)}
										</div>
									</div>

									{/* Lado derecho: Precio + Selector */}
									<div className="flex items-center space-x-3 flex-shrink-0">
										{/* Precio prominente */}
										<div className="text-right">
											<div className={`
												text-xl font-bold
												${isSelected ? 'text-orange-300' : 'text-orange-400'}
											`}>
												${membership.price}
											</div>
											<div className="text-xs text-gray-400">
												/mes
											</div>
										</div>

										{/* Indicador de selección minimalista */}
										<div className={`
											w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
											${isSelected 
												? 'bg-orange-400 border-orange-400' 
												: 'border-gray-400'
											}
										`}>
											{isSelected && (
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>

			{/* Error Display - Simplificado */}
			{error && (
				<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 backdrop-blur-sm">
					<div className="flex items-center space-x-2">
						<svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
						</svg>
						<p className="text-sm text-red-300">{error}</p>
					</div>
				</div>
			)}
		</div>
	)
} 
