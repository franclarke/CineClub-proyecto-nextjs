'use client'

import { useState, useOptimistic, useMemo } from 'react'
import { useCart } from '@/lib/cart/cart-context'
import { Event, Seat, Reservation, User, MembershipTier } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'
import { Crown, Users, Calendar, MapPin, Sparkles, AlertCircle, ArrowLeft, Info } from 'lucide-react'
import { formatFullDate, formatTime } from '@/lib/utils/date'
import { BackButton } from '@/app/components/ui/back-button'

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
			const seatsPerRow = tier === 'Puff XXL Estelar' ? 8 : tier === 'Reposera Deluxe' ? 10 : 12;
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
		const isPremiumTier = tier === 'Puff XXL Estelar';
		const isVipTier = tier === 'Reposera Deluxe';

		const baseClasses = "transition-all duration-200 ease-out flex items-center justify-center text-xs font-medium rounded-lg relative border cursor-pointer transform-gpu";

		if (isReserved) {
			return `${baseClasses} bg-soft-gray/30 text-soft-gray/60 cursor-not-allowed border-soft-gray/20 opacity-60`;
		} else if (!canSelect) {
			return `${baseClasses} bg-soft-gray/10 text-soft-gray/40 cursor-not-allowed border-dashed border-soft-gray/20 opacity-50`;
		} else if (isSelected) {
			if (isPremiumTier) {
				return `${baseClasses} bg-soft-gold text-deep-night border-soft-gold shadow-lg shadow-soft-gold/30 scale-110 ring-2 ring-soft-gold/20`;
			} else if (isVipTier) {
				return `${baseClasses} bg-soft-beige text-deep-night border-soft-beige shadow-lg shadow-soft-beige/30 scale-110 ring-2 ring-soft-beige/20`;
			} else {
				return `${baseClasses} bg-sunset-orange text-deep-night border-sunset-orange shadow-lg shadow-sunset-orange/30 scale-110 ring-2 ring-sunset-orange/20`;
			}
		} else {
			if (isPremiumTier) {
				return `${baseClasses} bg-soft-gold/20 text-soft-gold border-soft-gold/40 hover:bg-soft-gold/35 hover:border-soft-gold/60 hover:scale-105 hover:shadow-md hover:shadow-soft-gold/20`;
			} else if (isVipTier) {
				return `${baseClasses} bg-soft-beige/20 text-soft-beige border-soft-beige/40 hover:bg-soft-beige/35 hover:border-soft-beige/60 hover:scale-105 hover:shadow-md hover:shadow-soft-beige/20`;
			} else {
				return `${baseClasses} bg-sunset-orange/20 text-sunset-orange border-sunset-orange/40 hover:bg-sunset-orange/35 hover:border-sunset-orange/60 hover:scale-105 hover:shadow-md hover:shadow-sunset-orange/20`;
			}
		}
	};

	return (
		<div className="w-full max-w-5xl mx-auto">
			{/* Screen indicator */}
			<div className="mb-12 md:mb-16 text-center">
				<div className="w-full max-w-lg mx-auto h-4 bg-gradient-to-r from-transparent via-soft-gold/70 to-transparent rounded-full mb-6 shadow-lg shadow-soft-gold/20" />
				<p className="text-soft-beige text-base font-bold tracking-wider">PANTALLA</p>
			</div>

			{/* Amphitheater seating */}
			<div className="space-y-3 md:space-y-4 mb-12">
				{amphitheaterRows.map((row, rowIndex) => {
					const isPremiumTier = row.tier === 'Puff XXL Estelar';
					const isVipTier = row.tier === 'Reposera Deluxe';
					const totalRows = amphitheaterRows.length;
					const curveOffset = (rowIndex / totalRows) * 20;

					return (
						<div key={`${row.tier}-${row.rowNumber}`} className="relative py-1">
							{/* Row identifier */}
							<div className="absolute -left-14 md:-left-18 top-1/2 transform -translate-y-1/2 hidden sm:block">
								<div className={`text-sm px-3 py-2 rounded-lg font-bold shadow-md ${
									isPremiumTier ? 'bg-soft-gold/25 text-soft-gold border border-soft-gold/50' :
									isVipTier ? 'bg-soft-beige/25 text-soft-beige border border-soft-beige/50' :
									'bg-sunset-orange/25 text-sunset-orange border border-sunset-orange/50'
								}`}>
									{row.rowNumber}
								</div>
							</div>

							{/* Seat row */}
							<div
								className="flex justify-center items-center gap-1.5 md:gap-2"
								style={{
									marginLeft: `${curveOffset}px`,
									marginRight: `${curveOffset}px`
								}}
							>
								{row.seats.map((seat) => {
									const isReserved = !!seat.reservation;
									const canSelect = canUserSelectSeat(seat, currentUserMembership).allowed;
									const seatSize = isPremiumTier ? 'w-8 h-8 md:w-10 md:h-10' : isVipTier ? 'w-7 h-7 md:w-9 md:h-9' : 'w-6 h-6 md:w-8 md:h-8';

									return (
										<div
											key={seat.id}
											className={`${getSeatClasses(seat, row.tier)} ${seatSize} text-xs`}
											onClick={() => !isReserved && canSelect && onSeatSelect(seat.id)}
										>
											<span className="text-xs font-medium">{seat.seatNumber}</span>
											{isPremiumTier && !isReserved && (
												<Sparkles className="absolute -top-1 -right-1 w-2.5 h-2.5 text-soft-gold animate-pulse" />
											)}
										</div>
									);
								})}
							</div>
						</div>
					);
				})}
			</div>

			{/* Stage distance indicator */}
			<div className="text-center">
				<div className="text-sm text-soft-beige/80 space-x-8 font-semibold">
					<span>← Más cerca de la pantalla</span>
					<span>Más lejos de la pantalla →</span>
				</div>
			</div>
		</div>
	);
};

export function SeatMapClient({ event, currentUser }: SeatMapClientProps) {
	const { addSeat, toggleCart } = useCart()
	const [selectedSeats, setSelectedSeats] = useState<string[]>([])
	const [isProcessing, setIsProcessing] = useState(false)

	// Optimistic state for seat reservations
	const [optimisticSeats] = useOptimistic(
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
							orderId: null,
							createdAt: new Date(),
							updatedAt: new Date(),
							user: currentUser
						}
					}
					: seat
			)
	)

	// Group seats by tier
	const seatsByTier = useMemo(() => {
		const grouped = optimisticSeats.reduce((acc, seat) => {
			if (!acc[seat.tier]) {
				acc[seat.tier] = []
			}
			acc[seat.tier].push(seat)
			return acc
		}, {} as Record<string, SeatWithReservation[]>)

		const tierOrder = { 'Puff XXL Estelar': 1, 'Reposera Deluxe': 2, 'Banquito': 3 }
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
			const tierPrices = { 'Puff XXL Estelar': 50, 'Reposera Deluxe': 35, 'Banquito': 25 };
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
			selectedSeats.forEach(seatId => {
				const seat = optimisticSeats.find(s => s.id === seatId)
				if (seat) {
					const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
					addSeat(event, seat, expiresAt)
				}
			})

			setSelectedSeats([])
			toggleCart()
			setIsProcessing(false)
		} catch (error) {
			console.error('Error:', error)
			alert('Error al agregar asientos al carrito. Por favor intenta de nuevo.')
			setIsProcessing(false)
		}
	}

	return (
		<div className="min-h-screen bg-deep-night">
			<div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
				{/* Header */}
				<div className="mb-6 md:mb-8">
					<BackButton href={`/events/${event.id}`} />
					<div className="mt-4 md:mt-6 text-center">
						<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-soft-beige mb-3">
							Seleccionar Asientos
						</h1>
						<p className="text-base md:text-lg text-soft-beige/90 font-medium">
							{event.title}
						</p>
						<p className="text-sm md:text-base text-soft-beige/70 mt-1">
							{formatFullDate(event.dateTime)}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
					{/* Main seat map */}
					<div className="lg:col-span-3 space-y-8">
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/10 rounded-2xl p-6 md:p-10">
							<AmphitheaterSeatMap
								seatsByTier={seatsByTier}
								selectedSeats={selectedSeats}
								currentUserMembership={currentUser.membership}
								onSeatSelect={handleSeatSelect}
							/>
						</div>

						{/* Compact floating legend */}
						<div className="flex justify-center">
							<div className="inline-flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 bg-deep-night/90 backdrop-blur-md border border-soft-gray/30 rounded-full px-6 md:px-8 py-4 shadow-xl">
								{/* Tier types */}
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-gold rounded-full border border-soft-gold/50"></div>
									<span className="text-sm font-semibold text-soft-gold hidden sm:inline">Puff XXL ($50)</span>
									<span className="text-sm font-semibold text-soft-gold sm:hidden">$50</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-beige rounded-full border border-soft-beige/50"></div>
									<span className="text-sm font-semibold text-soft-beige hidden sm:inline">Reposera ($35)</span>
									<span className="text-sm font-semibold text-soft-beige sm:hidden">$35</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-sunset-orange rounded-full border border-sunset-orange/50"></div>
									<span className="text-sm font-semibold text-sunset-orange hidden sm:inline">Banquito ($25)</span>
									<span className="text-sm font-semibold text-sunset-orange sm:hidden">$25</span>
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-gray rounded-full border border-soft-gray/50"></div>
									<span className="text-sm font-semibold text-soft-beige/80">Ocupado</span>
								</div>
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6 lg:space-y-8">
						{/* Event info - Enhanced visibility */}
						<div className="bg-deep-night/40 backdrop-blur-sm border border-soft-gray/20 rounded-xl p-5 space-y-4">
							<div className="flex items-center gap-3">
								<Calendar className="w-5 h-5 text-sunset-orange" />
								<h3 className="text-lg font-bold text-soft-beige">Evento</h3>
							</div>
							<div className="space-y-3">
								<div>
									<p className="text-base font-semibold text-soft-beige">{event.title}</p>
									<p className="text-sm text-soft-beige/80 font-medium">{formatFullDate(event.dateTime)} • {formatTime(event.dateTime)}</p>
								</div>
								{event.location && (
									<div className="flex items-center gap-2">
										<MapPin className="w-4 h-4 text-sunset-orange/80" />
										<p className="text-sm text-soft-beige/80 font-medium">{event.location}</p>
									</div>
								)}
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4 text-sunset-orange/80" />
									<p className="text-sm text-soft-beige/80 font-medium">
										{getAvailableSeatsCount(event.seats)} de {event.seats.length} disponibles
									</p>
								</div>
							</div>
						</div>

						{/* Selection summary - Highlighted */}
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/20 rounded-xl p-5 lg:p-6 shadow-lg">
							<h3 className="text-xl font-bold text-soft-beige mb-6">Resumen</h3>
							
							{selectionInfo.count > 0 ? (
								<div className="space-y-5">
									<div className="space-y-3">
										{Object.entries(selectionInfo.tierBreakdown).map(([tier, count]) => (
											<div key={tier} className="flex justify-between items-center py-2">
												<span className="text-sm font-medium text-soft-gray truncate">{tier}</span>
												<span className="text-sm font-semibold text-soft-beige">{count}</span>
											</div>
										))}
									</div>
									<div className="border-t border-soft-gray/20 pt-4">
										<div className="flex justify-between items-center mb-5">
											<span className="text-lg font-bold text-soft-beige">Total</span>
											<span className="text-xl font-bold text-soft-gold">${selectionInfo.totalPrice}</span>
										</div>
										<Button
											onClick={handleProceedToCheckout}
											disabled={isProcessing}
											className="w-full bg-gradient-to-r from-sunset-orange to-soft-gold hover:shadow-lg transition-all duration-200"
										>
											{isProcessing ? 'Procesando...' : 'Agregar al Carrito'}
										</Button>
									</div>
								</div>
							) : (
								<div className="text-center py-8 lg:py-10">
									<div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sunset-orange/10 to-soft-gold/10 rounded-full flex items-center justify-center animate-pulse">
										<div className="w-8 h-8 bg-gradient-to-br from-sunset-orange/20 to-soft-gold/20 rounded-full flex items-center justify-center">
											<Sparkles className="w-4 h-4 text-sunset-orange" />
										</div>
									</div>
									<p className="text-base font-semibold text-soft-beige mb-2">¡Elige tus asientos!</p>
									<p className="text-sm text-soft-gray/80">Selecciona los mejores lugares para disfrutar del evento</p>
								</div>
							)}
						</div>

						{/* Membership info - Enhanced visibility */}
						<div className="bg-deep-night/40 backdrop-blur-sm border border-soft-gray/20 rounded-xl p-5 space-y-4">
							<div className="flex items-center gap-3">
								<Crown className="w-5 h-5 text-soft-gold" />
								<h3 className="text-lg font-bold text-soft-beige">Membresía</h3>
							</div>
							<div className="space-y-2">
								<p className="text-base font-semibold text-soft-beige">{currentUser.membership.name}</p>
								<p className="text-sm text-soft-beige/80 font-medium">
									Acceso: {getTierAccessText(currentUser.membership)}
								</p>
							</div>
						</div>
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

	if (userTierPriority > seatTierPriority) {
		const upgradeMessage = userMembership.name === 'Banquito' && seat.tier === 'Reposera Deluxe'
			? 'Actualiza a membresía Reposera Deluxe o Puff XXL Estelar para acceder a estos asientos premium.'
			: userMembership.name === 'Banquito' && seat.tier === 'Puff XXL Estelar'
				? 'Los asientos Puff XXL Estelar son exclusivos para miembros Puff XXL Estelar. Actualiza tu membresía para acceder.'
				: userMembership.name === 'Reposera Deluxe' && seat.tier === 'Puff XXL Estelar'
					? 'Los asientos Puff XXL Estelar son exclusivos para miembros Puff XXL Estelar. Actualiza tu membresía para acceder.'
					: `Este asiento está reservado para miembros ${seat.tier}. Actualiza tu membresía para acceder.`

		return {
			allowed: false,
			reason: upgradeMessage
		}
	}

	return { allowed: true, reason: '' }
}

function getTierPriority(tier: string): number {
	const priorities = { 'Puff XXL Estelar': 1, 'Reposera Deluxe': 2, 'Banquito': 3 }
	return priorities[tier as keyof typeof priorities] || 999
}

function getTierAccessText(membership: MembershipTier): string {
	switch (membership.priority) {
		case 1: return 'Todos los niveles';
		case 2: return 'Reposera Deluxe y Banquito';
		case 3: return 'Solo Banquito';
		default: return 'Solo Banquito';
	}
}

function getAvailableSeatsCount(seats: SeatWithReservation[]): number {
	return seats.filter(seat => !seat.reservation).length;
} 