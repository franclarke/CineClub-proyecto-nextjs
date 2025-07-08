'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart/cart-context'
import { Event, Seat } from '@prisma/client'
import { Button } from '@/app/components/ui/button'
import { ShoppingCart, Ticket, Clock, CheckCircle } from 'lucide-react'
import { SeatCartItem } from '@/types/cart'

interface SeatSelectionButtonProps {
	event: Event
	seat: Seat
	isSelected: boolean
	isReserved: boolean
	canSelect: boolean
	onSeatClick: (seatId: string) => void
	className?: string
}

export function SeatSelectionButton({
	event,
	seat,
	isSelected,
	isReserved,
	canSelect,
	onSeatClick,
	className = ''
}: SeatSelectionButtonProps) {
	const { addSeat, hasSeat } = useCart()
	const [isAddingToCart, setIsAddingToCart] = useState(false)
	const isInCart = hasSeat(event.id, seat.id)

	const handleAddToCart = async (e: React.MouseEvent) => {
		e.stopPropagation()

		if (isInCart || isReserved || !canSelect) return

		setIsAddingToCart(true)

		try {
			// Calcular tiempo de expiración (15 minutos)
			const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

			// Agregar al carrito global
			addSeat(event, seat, expiresAt)

			// Feedback visual
			setTimeout(() => {
				setIsAddingToCart(false)
			}, 1000)
		} catch (error) {
			console.error('Error adding seat to cart:', error)
			setIsAddingToCart(false)
		}
	}

	const getSeatButtonClasses = () => {
		const baseClasses = "relative transition-all duration-200 flex items-center justify-center text-xs font-semibold rounded-lg border group"

		if (isReserved) {
			return `${baseClasses} bg-neutral-600 text-neutral-400 cursor-not-allowed opacity-50 border-neutral-500`
		}

		if (isInCart) {
			return `${baseClasses} bg-soft-gold text-deep-night shadow-lg shadow-soft-gold/30 border-soft-gold ring-2 ring-soft-gold/50`
		}

		if (!canSelect) {
			return `${baseClasses} bg-neutral-700 text-neutral-500 cursor-not-allowed border-dashed border-neutral-600`
		}

		if (isSelected) {
			const tierColors = {
				'Puff XXL Estelar': 'bg-yellow-500 text-deep-night border-yellow-500 shadow-lg shadow-yellow-500/30',
				'Reposera Deluxe': 'bg-gray-300 text-deep-night border-gray-300 shadow-lg shadow-gray-300/30',
				'Banquito': 'bg-orange-400 text-deep-night border-orange-400 shadow-lg shadow-orange-400/30'
			}
			return `${baseClasses} ${tierColors[seat.tier as keyof typeof tierColors] || tierColors.Banquito} `
		}

		// Available state
		const tierColors = {
			'Puff XXL Estelar': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500 hover:text-deep-night hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30',
			'Reposera Deluxe': 'bg-gray-300/20 text-gray-300 border-gray-300/30 hover:bg-gray-300 hover:text-deep-night hover:border-gray-300 hover:shadow-lg hover:shadow-gray-300/30',
			'Banquito': 'bg-orange-400/20 text-orange-300 border-orange-400/30 hover:bg-orange-400 hover:text-deep-night hover:border-orange-400 hover:shadow-lg hover:shadow-orange-400/30'
		}

		return `${baseClasses} ${tierColors[seat.tier as keyof typeof tierColors] || tierColors.Banquito} cursor-pointer`
	}

	return (
		<div className="relative">
			<motion.div
				className={`${getSeatButtonClasses()} ${className}`}
				onClick={() => onSeatClick(seat.id)}
				whileHover={canSelect && !isReserved ? { scale: 1.05 } : {}}
				whileTap={canSelect && !isReserved ? { scale: 0.95 } : {}}
			>
				{seat.seatNumber}

				{/* Premium seat indicator */}
				{seat.tier === 'Puff XXL Estelar' && !isReserved && (
					<motion.div
						className="absolute -top-1 -right-1 text-yellow-400"
						animate={{ rotate: [0, 10, -10, 0] }}
						transition={{ duration: 2, repeat: Infinity }}
					>
						<Ticket className="w-2.5 h-2.5" />
					</motion.div>
				)}

				{/* In cart indicator */}
				{isInCart && (
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute -top-1 -left-1 w-4 h-4 bg-soft-gold rounded-full flex items-center justify-center"
					>
						<CheckCircle className="w-2.5 h-2.5 text-deep-night" />
					</motion.div>
				)}
			</motion.div>

			{/* Quick add to cart button */}
			{canSelect && !isReserved && !isInCart && isSelected && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10"
				>
					<Button
						onClick={handleAddToCart}
						disabled={isAddingToCart}
						className="bg-soft-gold text-deep-night hover:bg-soft-gold/90 px-3 py-1.5 h-auto text-xs font-semibold shadow-lg border-none whitespace-nowrap"
					>
						{isAddingToCart ? (
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
							>
								<Clock className="w-3 h-3" />
							</motion.div>
						) : (
							<>
								<ShoppingCart className="w-3 h-3 mr-1" />
								Agregar
							</>
						)}
					</Button>
				</motion.div>
			)}
		</div>
	)
}

// Hook personalizado para integrar con la selección de seats
export function useSeatSelection(event: Event) {
	const { state, hasSeat } = useCart()
	const [localSelectedSeats, setLocalSelectedSeats] = useState<string[]>([])

	// Obtener seats que están en el carrito para este evento
	const seatsInCart = state.items
		.filter((item): item is SeatCartItem => item.type === 'seat' && item.eventId === event.id)
		.map(item => item.seat.id)

	const handleSeatClick = (seatId: string) => {
		if (hasSeat(event.id, seatId)) {
			return // Ya está en el carrito, no hacer nada
		}

		setLocalSelectedSeats(prev =>
			prev.includes(seatId)
				? prev.filter(id => id !== seatId)
				: [...prev, seatId]
		)
	}

	const clearSelection = () => {
		setLocalSelectedSeats([])
	}

	const getSelectionInfo = () => {
		const totalSelected = localSelectedSeats.length + seatsInCart.length
		return {
			localSelected: localSelectedSeats,
			inCart: seatsInCart,
			totalSelected,
			hasSelection: totalSelected > 0
		}
	}

	return {
		localSelectedSeats,
		seatsInCart,
		handleSeatClick,
		clearSelection,
		getSelectionInfo,
		isInCart: (seatId: string) => hasSeat(event.id, seatId)
	}
} 
