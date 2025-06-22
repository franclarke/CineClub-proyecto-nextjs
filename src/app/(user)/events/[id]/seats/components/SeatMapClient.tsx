'use client'

import { useState, useOptimistic, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart/cart-context'
import { Event, Seat, Reservation, User, MembershipTier } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'
import { Separator } from '@/app/components/ui/separator'
import { Crown, Users, Calendar, MapPin, Sparkles, AlertCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { LoadingOverlay } from './LoadingOverlay'
import { formatFullDate, formatTime } from '@/lib/utils/date'

type SeatWithReservation = Seat & {
	reservation: (Reservation & {
		user: User & {
			membership: MembershipTier
		}
	}) | null
}

type EventWithSeats = Event & {
	seats: SeatWithReservation[]
}

type UserWithMembership = User & {
	membership: MembershipTier
}

interface SeatMapClientProps {
	event: EventWithSeats
	currentUser: UserWithMembership
}

// Amphitheater Seat Map Component
const AmphitheaterSeatMap = ({ 
	seatsByTier, 
	selectedSeats, 
	currentUserMembership, 
	onSeatSelect 
}: { 
	seatsByTier: [string, SeatWithReservation[]][];
	selectedSeats: string[];
	currentUserMembership: MembershipTier;
	onSeatSelect: (seatId: string) => void;
}) => {
	// Organize seats in amphitheater rows
	const arrangeSeatsInAmphitheater = () => {
		const rows: Array<{
			tier: string;
			rowNumber: number;
			seats: SeatWithReservation[];
		}> = [];

		seatsByTier.forEach(([tier, seats]) => {
			// Calculate seats per row (aim for 8-12 seats per row)
			const seatsPerRow = tier === 'Gold' ? 8 : tier === 'Silver' ? 10 : 12;
			const numRows = Math.ceil(seats.length / seatsPerRow);

			for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
				const startIndex = rowIndex * seatsPerRow;
				const rowSeats = seats.slice(startIndex, startIndex + seatsPerRow);
				
				if (rowSeats.length > 0) {
					rows.push({
						tier,
						rowNumber: rowIndex + 1,
						seats: rowSeats
					});
				}
			}
		});

		return rows;
	};

	const amphitheaterRows = arrangeSeatsInAmphitheater();

	const getSeatClasses = (seat: SeatWithReservation, tier: string) => {
		const isSelected = selectedSeats.includes(seat.id);
		const isReserved = !!seat.reservation;
		const canSelect = canUserSelectSeat(seat, currentUserMembership).allowed;
		const isPremiumTier = tier === 'Gold';
		const isVipTier = tier === 'Silver';

		const baseClasses = "transition-all duration-200 flex items-center justify-center text-xs font-semibold rounded-lg relative border";
		
		if (isReserved) {
			return `${baseClasses} bg-neutral-600 text-neutral-400 cursor-not-allowed opacity-50 border-neutral-500`;
		} else if (!canSelect) {
			return `${baseClasses} bg-neutral-700 text-neutral-500 cursor-not-allowed border-dashed border-neutral-600`;
		} else if (isSelected) {
			if (isPremiumTier) {
				return `${baseClasses} bg-soft-gold text-deep-night shadow-lg shadow-soft-gold/50 scale-105 border-soft-gold`;
			} else if (isVipTier) {
				return `${baseClasses} bg-gray-300 text-deep-night shadow-lg shadow-gray-300/50 scale-105 border-gray-300`;
			} else {
				return `${baseClasses} bg-orange-400 text-deep-night shadow-lg shadow-orange-400/50 scale-105 border-orange-400`;
			}
		} else {
			if (isPremiumTier) {
				return `${baseClasses} bg-soft-gold/20 text-soft-gold hover:bg-soft-gold hover:text-deep-night hover:shadow-lg hover:shadow-soft-gold/30 hover:scale-105 cursor-pointer border-soft-gold/30 hover:border-soft-gold`;
			} else if (isVipTier) {
				return `${baseClasses} bg-gray-300/20 text-gray-300 hover:bg-gray-300 hover:text-deep-night hover:shadow-lg hover:shadow-gray-300/30 hover:scale-105 cursor-pointer border-gray-300/30 hover:border-gray-300`;
			} else {
				return `${baseClasses} bg-orange-400/20 text-orange-300 hover:bg-orange-400 hover:text-deep-night hover:shadow-lg hover:shadow-orange-400/30 hover:scale-105 cursor-pointer border-orange-400/30 hover:border-orange-400`;
			}
		}
	};

	return (
		<div className="relative w-full max-w-5xl mx-auto px-6">
			{/* Screen/Stage area */}
			<div className="mb-16 text-center">
				<div className="w-full h-4 bg-gradient-to-r from-transparent via-soft-gold/60 to-transparent rounded-full mb-3" />
				<div className="text-soft-gray text-sm uppercase tracking-wide font-medium">
					🎬 Pantalla
				</div>
			</div>

			{/* Amphitheater rows */}
			<div className="space-y-4">
				{amphitheaterRows.map((row, rowIndex) => {
					const isPremiumTier = row.tier === 'Gold';
					const isVipTier = row.tier === 'Silver';
					
					// Calculate curve for amphitheater effect
					const totalRows = amphitheaterRows.length;
					const curveIntensity = (rowIndex / totalRows) * 20; // More curve towards the back
					
					return (
						<div key={`${row.tier}-${row.rowNumber}`} className="relative">
							{/* Row label */}
							<div className="absolute -left-20 top-1/2 transform -translate-y-1/2">
								<div className={`text-xs font-medium px-2 py-1 rounded-md ${
									isPremiumTier ? 'bg-soft-gold/20 text-soft-gold border border-soft-gold/30' : 
									isVipTier ? 'bg-gray-400/20 text-gray-400 border border-gray-400/30' : 
									'bg-orange-400/20 text-orange-400 border border-orange-400/30'
								}`}>
									{row.tier} {row.rowNumber}
								</div>
							</div>
							
							{/* Seats in row */}
							<div 
								className="flex justify-center items-center gap-2"
								style={{
									transform: `perspective(1000px) rotateX(${curveIntensity / 4}deg)`,
									marginLeft: `${curveIntensity}px`,
									marginRight: `${curveIntensity}px`
								}}
							>
								{row.seats.map((seat) => {
									const isReserved = !!seat.reservation;
									const canSelect = canUserSelectSeat(seat, currentUserMembership).allowed;
									
									return (
										<div
											key={seat.id}
											className={getSeatClasses(seat, row.tier)}
											style={{
												width: isPremiumTier ? '2.75rem' : isVipTier ? '2.5rem' : '2.25rem',
												height: isPremiumTier ? '2.75rem' : isVipTier ? '2.5rem' : '2.25rem',
											}}
											onClick={() => !isReserved && canSelect && onSeatSelect(seat.id)}
										>
											{seat.seatNumber}
											
											{/* Premium seat indicator */}
											{isPremiumTier && !isReserved && (
												<div className="absolute -top-1 -right-1 text-soft-gold animate-pulse">
													<Sparkles size={10} />
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* Distance indicators */}
			<div className="mt-8 space-y-2">
				<div className="flex justify-center">
					<div className="text-xs text-soft-gray space-x-6">
						<span>← Más cerca de la pantalla</span>
						<span>Más lejos de la pantalla →</span>
					</div>
				</div>
				<div className="text-center">
					<p className="text-xs text-soft-gray/60">
						Los números en los asientos son únicos (1-30). Las etiquetas de fila indican el nivel y la fila dentro de ese nivel.
					</p>
				</div>
			</div>
		</div>
	);
};

export function SeatMapClient({ event, currentUser }: SeatMapClientProps) {
	const router = useRouter()
	const { addSeat, toggleCart } = useCart()
	const [selectedSeats, setSelectedSeats] = useState<string[]>([])
	const [isProcessing, setIsProcessing] = useState(false)

	// Optimistic state for seat reservations
	const [optimisticSeats, addOptimisticReservation] = useOptimistic(
		event.seats,
		(state, seatId: string) =>
			state.map(seat =>
				seat.id === seatId
					? {
							...seat,
							reservation: {
								id: 'temp',
								userId: currentUser.id,
								eventId: event.id,
								seatId: seat.id,
								status: 'pending',
								createdAt: new Date(),
								updatedAt: new Date(),
								user: currentUser
							}
						}
					: seat
			)
	)

	// Group seats by tier for circular arrangement
	const seatsByTier = useMemo(() => {
		const grouped = optimisticSeats.reduce((acc, seat) => {
			if (!acc[seat.tier]) {
				acc[seat.tier] = []
			}
			acc[seat.tier].push(seat)
			return acc
		}, {} as Record<string, SeatWithReservation[]>)

		// Sort tiers by priority (Gold: 1, Silver: 2, Bronze: 3)
		const tierOrder = { 'Gold': 1, 'Silver': 2, 'Bronze': 3 }
		return Object.entries(grouped).sort(([a], [b]) => 
			(tierOrder[a as keyof typeof tierOrder] || 999) - 
			(tierOrder[b as keyof typeof tierOrder] || 999)
		)
	}, [optimisticSeats])

	// Calculate selection info
	const selectionInfo = useMemo(() => {
		const selectedSeatData = optimisticSeats.filter(seat => 
			selectedSeats.includes(seat.id)
		)
		
		const totalPrice = selectedSeatData.reduce((total, seat) => {
			// Price based on tier - Premium tiers cost more
			const tierPrices = { 'Gold': 50, 'Silver': 35, 'Bronze': 25 };
			return total + (tierPrices[seat.tier as keyof typeof tierPrices] || 25);
		}, 0);
		
		const tierBreakdown = selectedSeatData.reduce((acc, seat) => {
			acc[seat.tier] = (acc[seat.tier] || 0) + 1
			return acc
		}, {} as Record<string, number>)

		return {
			count: selectedSeats.length,
			totalPrice,
			tierBreakdown,
			seats: selectedSeatData
		}
	}, [selectedSeats, optimisticSeats])

	const handleSeatSelect = (seatId: string) => {
		const seat = optimisticSeats.find(s => s.id === seatId)
		if (!seat || seat.reservation) return

		// Check if user's membership allows this tier
		const canSelectTier = canUserSelectSeat(seat, currentUser.membership)
		if (!canSelectTier.allowed) {
			alert(canSelectTier.reason)
			return
		}

		setSelectedSeats(prev => 
			prev.includes(seatId)
				? prev.filter(id => id !== seatId)
				: [...prev, seatId]
		)
	}

	const handleProceedToCheckout = async () => {
		if (selectedSeats.length === 0) return

		setIsProcessing(true)
		
		try {
			// Agregar asientos al carrito global
			selectedSeats.forEach(seatId => {
				const seat = optimisticSeats.find(s => s.id === seatId)
				if (seat) {
					const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutos
					addSeat(event, seat, expiresAt)
				}
			})

			// Limpiar selección local
			setSelectedSeats([])

			// Abrir carrito para checkout
			toggleCart()
			
			setIsProcessing(false)
		} catch (error) {
			console.error('Error:', error)
			alert('Error al agregar asientos al carrito. Por favor intenta de nuevo.')
			setIsProcessing(false)
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-deep-night to-deep-night/90 animate-fade-in">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-display text-5xl md:text-6xl font-bold text-soft-beige mb-4 tracking-tight">
						Seleccionar Asientos
					</h1>
					<p className="text-xl text-soft-gray max-w-3xl mx-auto">
						Elige tu lugar perfecto para <span className="text-sunset-orange font-semibold">{event.title}</span>
					</p>
				</div>

				<div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
					{/* Seat Map */}
					<div className="xl:col-span-3">
						<GlassCard variant="default" className="p-8 min-h-[600px]">
							{/* Title */}
							<h2 className="text-2xl font-semibold text-soft-beige text-center mb-8">
								Mapa de Asientos - Vista Anfiteatro
							</h2>
							
							{/* Amphitheater Seat Map */}
							<AmphitheaterSeatMap
								seatsByTier={seatsByTier}
								selectedSeats={selectedSeats}
								currentUserMembership={currentUser.membership}
								onSeatSelect={handleSeatSelect}
							/>

							{/* Legend */}
							<div className="mt-12 bg-deep-night/40 rounded-xl p-6 border border-soft-gray/20">
								<h4 className="text-soft-beige font-medium mb-6 text-center text-lg">
									Información de Asientos
								</h4>
								
								{/* Tier Legend */}
								<div className="grid grid-cols-3 gap-6 mb-8">
									<div className="text-center">
										<div className="w-10 h-10 mx-auto mb-3 bg-soft-gold/20 text-soft-gold border border-soft-gold/30 rounded-lg flex items-center justify-center text-sm font-bold">
											G
										</div>
										<div className="text-sm font-medium text-soft-gold">Gold</div>
										<div className="text-xs text-soft-gray">$50 por asiento</div>
									</div>
									<div className="text-center">
										<div className="w-10 h-10 mx-auto mb-3 bg-gray-300/20 text-gray-300 border border-gray-300/30 rounded-lg flex items-center justify-center text-sm font-bold">
											S
										</div>
										<div className="text-sm font-medium text-gray-300">Silver</div>
										<div className="text-xs text-soft-gray">$35 por asiento</div>
									</div>
									<div className="text-center">
										<div className="w-10 h-10 mx-auto mb-3 bg-orange-400/20 text-orange-300 border border-orange-400/30 rounded-lg flex items-center justify-center text-sm font-bold">
											B
										</div>
										<div className="text-sm font-medium text-orange-300">Bronze</div>
										<div className="text-xs text-soft-gray">$25 por asiento</div>
									</div>
								</div>

								{/* Status Legend */}
								<div className="grid grid-cols-2 gap-4 mb-6">
									{[
										{ name: 'Disponible', color: 'bg-soft-gray/20 text-soft-gray border border-soft-gray/30', icon: '○' },
										{ name: 'Seleccionado', color: 'bg-soft-gold text-deep-night border border-soft-gold', icon: '●' },
										{ name: 'Reservado', color: 'bg-neutral-600 text-neutral-400 opacity-50 border border-neutral-500', icon: '✕' },
										{ name: 'No disponible', color: 'bg-neutral-700 text-neutral-500 border border-dashed border-neutral-600', icon: '◐' }
									].map((status) => (
										<div key={status.name} className="flex items-center gap-3">
											<div className={`w-6 h-6 rounded-lg ${status.color} flex items-center justify-center text-xs`}>
												{status.icon}
											</div>
											<span className="text-sm text-soft-gray">{status.name}</span>
										</div>
									))}
								</div>
								
								{/* Membership Access Info */}
								<div className="bg-gradient-to-r from-sunset-orange/10 to-transparent p-4 rounded-lg border-l-2 border-sunset-orange">
									<div className="flex items-start gap-3">
										<AlertCircle size={16} className="text-sunset-orange mt-0.5 flex-shrink-0" />
										<div className="space-y-2">
											<p className="text-sm text-soft-beige font-medium">
												Tu Membresía {currentUser.membership.name}
											</p>
											<p className="text-xs text-soft-gray">
												Puedes reservar: {getTierAccessText(currentUser.membership)}
											</p>
											{currentUser.membership.priority > 1 && (
												<p className="text-xs text-sunset-orange/80">
													💡 Tip: Actualiza tu membresía para acceder a mejores asientos
												</p>
											)}
										</div>
									</div>
								</div>
							</div>
						</GlassCard>
					</div>

										{/* Sidebar */}
					<div className="space-y-6">
						{/* Event Info */}
						<GlassCard variant="subtle" className="overflow-hidden">
							<div className="relative h-40 bg-gradient-to-br from-sunset-orange/20 to-warm-red/20">
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
								<div className="absolute inset-0 p-6 flex flex-col justify-end">
									<h2 className="text-2xl font-bold text-soft-beige mb-1">{event.title}</h2>
									<p className="text-sm text-soft-gray">{formatFullDate(event.dateTime)}</p>
								</div>
								<div className="absolute top-4 right-4 text-4xl opacity-60">🎬</div>
							</div>
							
							<div className="p-6 space-y-4">
								<div className="flex items-center gap-3">
									<Calendar size={18} className="text-sunset-orange" />
									<div>
										<p className="text-sm font-medium text-soft-beige">{formatFullDate(event.dateTime)}</p>
										<p className="text-xs text-soft-gray">{formatTime(event.dateTime)}</p>
									</div>
								</div>
								
								{event.location && (
									<div className="flex items-center gap-3">
										<MapPin size={18} className="text-sunset-orange" />
										<div>
											<p className="text-sm text-soft-beige">{event.location}</p>
										</div>
									</div>
								)}
								
								<div className="flex items-center gap-3">
									<Users size={18} className="text-sunset-orange" />
									<div>
										<p className="text-sm text-soft-beige">Capacidad: {event.seats.length} asientos</p>
										<p className="text-xs text-soft-gray">{getAvailableSeatsCount(event.seats)} disponibles</p>
									</div>
								</div>
							</div>
						</GlassCard>

						{/* Selection Summary */}
						<GlassCard variant="subtle" className="overflow-hidden">
							{/* Header with gradient background */}
							<div className="relative h-16 bg-gradient-to-br from-sunset-orange/20 to-warm-red/20">
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
								<div className="absolute inset-0 p-4 flex items-center">
									<h3 className="text-xl font-semibold text-soft-beige">Resumen de Selección</h3>
								</div>
							</div>
							
							<div className="p-6">
								{selectionInfo.count > 0 ? (
									<div className="space-y-4">
										{/* Selected seats count */}
										<div className="flex justify-between items-center p-3 bg-deep-night/20 rounded-lg">
											<span className="text-soft-gray text-sm">Asientos seleccionados</span>
											<span className="text-soft-beige font-semibold text-lg">{selectionInfo.count}</span>
										</div>
										
										{/* Tier breakdown */}
										<div className="space-y-2">
											{Object.entries(selectionInfo.tierBreakdown).map(([tier, count]) => (
												<div key={tier} className="flex justify-between items-center px-3 py-2">
													<div className="flex items-center gap-3">
														<div className={`w-2.5 h-2.5 rounded-full ${
															tier === 'Gold' ? 'bg-soft-gold' : 
															tier === 'Silver' ? 'bg-gray-400' : 
															'bg-orange-400'
														}`}></div>
														<span className="text-soft-gray text-sm">{tier}</span>
													</div>
													<div className="flex items-center gap-2">
														<span className="text-soft-beige text-sm">{count} x ${
															tier === 'Gold' ? '50' : tier === 'Silver' ? '35' : '25'
														}</span>
													</div>
												</div>
											))}
										</div>
										
										<div className="h-px bg-white/10" />
										
										{/* Total */}
										<div className="flex justify-between items-center p-3 bg-gradient-to-r from-soft-gold/10 to-transparent rounded-lg">
											<span className="text-soft-beige font-semibold">Total</span>
											<span className="text-soft-gold font-bold text-xl">${selectionInfo.totalPrice.toFixed(2)}</span>
										</div>
										
										{/* Action button */}
										<Button 
											onClick={handleProceedToCheckout}
											disabled={isProcessing}
											className="w-full bg-gradient-to-r from-sunset-orange to-warm-red hover:from-sunset-orange/90 hover:to-warm-red/90 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-[1.02]"
										>
											{isProcessing ? 'Agregando...' : 'Agregar al Carrito'}
										</Button>
									</div>
								) : (
									<div className="text-center py-6">
										<div className="w-14 h-14 mx-auto mb-3 bg-soft-gray/10 rounded-full flex items-center justify-center">
											<svg className="w-7 h-7 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13v6a2 2 0 102 0v-6M21 19a2 2 0 11-4 0 2 2 0 014 0z" />
											</svg>
										</div>
										<p className="text-soft-gray font-medium text-sm mb-1">No has seleccionado ningún asiento</p>
										<p className="text-xs text-soft-gray/70">Selecciona los asientos que deseas reservar</p>
									</div>
								)}
							</div>
						</GlassCard>

						{/* Membership Info */}
						<GlassCard variant="subtle" className="p-6">
							<div className="flex items-center gap-4">
								<div className={`flex items-center justify-center w-12 h-12 rounded-xl ${
									currentUser.membership.name === 'Gold' ? 'bg-soft-gold/20' :
									currentUser.membership.name === 'Silver' ? 'bg-gray-400/20' :
									'bg-orange-400/20'
								}`}>
									<Crown className={`h-6 w-6 ${
										currentUser.membership.name === 'Gold' ? 'text-soft-gold' :
										currentUser.membership.name === 'Silver' ? 'text-gray-400' :
										'text-orange-400'
									}`} />
								</div>
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-1">
										<p className="font-semibold text-soft-beige">
											Membresía {currentUser.membership.name}
										</p>
										<div className={`px-2 py-1 rounded-full text-xs font-medium ${
											currentUser.membership.name === 'Gold' ? 'bg-soft-gold/20 text-soft-gold' :
											currentUser.membership.name === 'Silver' ? 'bg-gray-400/20 text-gray-400' :
											'bg-orange-400/20 text-orange-400'
										}`}>
											Activa
										</div>
									</div>
									<p className="text-xs text-soft-gray">
										Prioridad de reserva activada
									</p>
								</div>
							</div>
						</GlassCard>
					</div>
				</div>
			</div>
		</div>
	)
}

// Helper functions
function canUserSelectSeat(seat: SeatWithReservation, userMembership: MembershipTier) {
	if (seat.reservation) {
		return { allowed: false, reason: 'Este asiento ya está reservado' }
	}

	const seatTierPriority = getTierPriority(seat.tier)
	const userTierPriority = userMembership.priority

	// User can only select seats of their tier or lower priority tiers
	// Lower priority number = higher tier (Gold=1, Silver=2, Bronze=3)
	if (userTierPriority > seatTierPriority) {
		const upgradeMessage = userMembership.name === 'Bronze' && seat.tier === 'Silver' 
			? 'Actualiza a membresía Silver o Gold para acceder a estos asientos premium.'
			: userMembership.name === 'Bronze' && seat.tier === 'Gold'
			? 'Los asientos Gold son exclusivos para miembros Gold. Actualiza tu membresía para acceder.'
			: userMembership.name === 'Silver' && seat.tier === 'Gold'
			? 'Los asientos Gold son exclusivos para miembros Gold. Actualiza tu membresía para acceder.'
			: `Este asiento está reservado para miembros ${seat.tier}. Actualiza tu membresía para acceder.`
			
		return {
			allowed: false,
			reason: upgradeMessage
		}
	}

	return { allowed: true, reason: '' }
}

function getTierPriority(tier: string): number {
	const priorities = { 'Gold': 1, 'Silver': 2, 'Bronze': 3 }
	return priorities[tier as keyof typeof priorities] || 999
}

function getTierAccessText(membership: MembershipTier): string {
	switch (membership.priority) {
		case 1: return 'Todos los niveles (Gold, Silver y Bronze)'; // Gold puede acceder a todos
		case 2: return 'Silver y Bronze'; // Silver puede acceder a Silver y Bronze
		case 3: return 'Solo Bronze'; // Bronze solo puede acceder a Bronze
		default: return 'Solo Bronze'; // Por defecto solo Bronze
	}
}

function getAvailableSeatsCount(seats: SeatWithReservation[]): number {
	return seats.filter(seat => !seat.reservation).length;
} 