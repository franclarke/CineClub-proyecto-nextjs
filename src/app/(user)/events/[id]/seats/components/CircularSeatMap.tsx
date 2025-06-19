'use client'

import { useMemo } from 'react'
import { Seat, Reservation, User, MembershipTier } from '@prisma/client'

type SeatWithReservation = Seat & {
	reservation: (Reservation & {
		user: User & {
			membership: MembershipTier
		}
	}) | null
}

interface CircularSeatMapProps {
	seatsByTier: [string, SeatWithReservation[]][]
	selectedSeats: string[]
	currentUserMembership: MembershipTier
	onSeatSelect: (seatId: string) => void
}

export function CircularSeatMap({
	seatsByTier,
	selectedSeats,
	currentUserMembership,
	onSeatSelect
}: CircularSeatMapProps) {
	// Calculate seat positions for circular arrangement
	const seatPositions = useMemo(() => {
		const positions: Array<{
			seat: SeatWithReservation
			x: number
			y: number
			radius: number
		}> = []

		const centerX = 300
		const centerY = 300
		const baseRadius = 80

		seatsByTier.forEach(([, seats], tierIndex) => {
			const radius = baseRadius + (tierIndex * 60)
			const angleStep = (2 * Math.PI) / seats.length
			const startAngle = -Math.PI / 2 // Start from top

			seats.forEach((seat, seatIndex) => {
				const angle = startAngle + (angleStep * seatIndex)
				const x = centerX + radius * Math.cos(angle)
				const y = centerY + radius * Math.sin(angle)

				positions.push({
					seat,
					x,
					y,
					radius: 16
				})
			})
		})

		return positions
	}, [seatsByTier])

	const getSeatColor = (seat: SeatWithReservation) => {
		if (seat.reservation) {
			return '#D94A29' // warm-red for reserved
		}
		if (selectedSeats.includes(seat.id)) {
			return '#FF8C42' // sunset-orange for selected
		}
		
		// Color by tier
		const tierColors = {
			'Gold': '#FFC857', // soft-gold
			'Silver': '#F0E3CA', // soft-beige
			'Bronze': '#4C4A3E'  // dark-olive
		}
		
		return tierColors[seat.tier as keyof typeof tierColors] || '#3A3A3C'
	}

	const getSeatStroke = (seat: SeatWithReservation) => {
		if (selectedSeats.includes(seat.id)) {
			return '#FF8C42'
		}
		if (seat.reservation) {
			return '#D94A29'
		}
		return 'transparent'
	}

	const canSelectSeat = (seat: SeatWithReservation) => {
		if (seat.reservation) return false
		
		const seatTierPriority = getTierPriority(seat.tier)
		const userTierPriority = currentUserMembership.priority
		
		return userTierPriority <= seatTierPriority
	}

	return (
		<div className="flex justify-center">
			<svg
				width="600"
				height="600"
				viewBox="0 0 600 600"
				className="max-w-full h-auto"
			>
				{/* Center decoration (stage/screen area) */}
				<circle
					cx="300"
					cy="300"
					r="40"
					fill="#1C1C1E"
					stroke="#3A3A3C"
					strokeWidth="2"
					strokeDasharray="5,5"
				/>
				<text
					x="300"
					y="305"
					textAnchor="middle"
					className="fill-soft-gray text-xs"
					fontSize="10"
				>
					ESCENARIO
				</text>

				{/* Tier circles (visual guides) */}
				{seatsByTier.map(([tier], tierIndex) => (
					<circle
						key={tier}
						cx="300"
						cy="300"
						r={80 + (tierIndex * 60)}
						fill="none"
						stroke="#3A3A3C"
						strokeWidth="1"
						strokeOpacity="0.3"
						strokeDasharray="3,3"
					/>
				))}

				{/* Seats */}
				{seatPositions.map(({ seat, x, y, radius }) => {
					const isSelectable = canSelectSeat(seat)
					const isSelected = selectedSeats.includes(seat.id)
					const isReserved = !!seat.reservation

					return (
						<g key={seat.id}>
							{/* Seat circle */}
							<circle
								cx={x}
								cy={y}
								r={radius}
								fill={getSeatColor(seat)}
								stroke={getSeatStroke(seat)}
								strokeWidth={isSelected ? "3" : "1"}
								className={`transition-all duration-200 ${
									isSelectable 
										? 'cursor-pointer hover:scale-110 hover:drop-shadow-lg' 
										: 'cursor-not-allowed opacity-60'
								}`}
								onClick={() => isSelectable && onSeatSelect(seat.id)}
							/>
							
							{/* Seat number */}
							<text
								x={x}
								y={y + 4}
								textAnchor="middle"
								className={`text-xs font-medium pointer-events-none ${
									seat.tier === 'Gold' ? 'fill-deep-night' : 'fill-soft-beige'
								}`}
								fontSize="12"
							>
								{seat.seatNumber}
							</text>

							{/* Reserved indicator */}
							{isReserved && (
								<circle
									cx={x + 12}
									cy={y - 12}
									r="4"
									fill="#D94A29"
									className="drop-shadow-sm"
								/>
							)}

							{/* Selected indicator */}
							{isSelected && (
								<circle
									cx={x}
									cy={y}
									r={radius + 4}
									fill="none"
									stroke="#FF8C42"
									strokeWidth="2"
									className="animate-pulse"
								/>
							)}
						</g>
					)
				})}

				{/* Tier labels */}
				{seatsByTier.map(([tier], tierIndex) => {
					const labelRadius = 80 + (tierIndex * 60)
					const labelX = 300 + labelRadius + 30
					const labelY = 300
					
					return (
						<text
							key={`label-${tier}`}
							x={labelX}
							y={labelY}
							textAnchor="start"
							className="fill-soft-gray text-sm font-medium"
							fontSize="14"
						>
							{tier}
						</text>
					)
				})}
			</svg>
		</div>
	)
}

function getTierPriority(tier: string): number {
	const priorities = { 'Gold': 1, 'Silver': 2, 'Bronze': 3 }
	return priorities[tier as keyof typeof priorities] || 999
} 