import { prisma } from '@/lib/prisma'

/**
 * Limpia reservas pendientes que hayan expirado
 * @param eventId - ID del evento específico (opcional, si no se proporciona limpia todas)
 * @param expirationMinutes - Minutos después de los cuales una reserva pendiente expira (default: 30)
 */
export async function cleanupExpiredReservations(eventId?: string, expirationMinutes: number = 30) {
	try {
		const expirationTime = new Date(Date.now() - expirationMinutes * 60 * 1000)
		
		const whereClause = {
			status: 'pending',
			createdAt: {
				lt: expirationTime
			},
			...(eventId && { eventId })
		}

		const deletedReservations = await prisma.reservation.deleteMany({
			where: whereClause
		})

		// Cleanup completed

		return deletedReservations.count
	} catch (error) {
		return 0
	}
}

/**
 * Verifica si un asiento está disponible para reservar
 * @param seatId - ID del asiento
 * @returns true si está disponible, false si no
 */
export async function isSeatAvailable(seatId: string): Promise<boolean> {
	try {
		const seat = await prisma.seat.findUnique({
			where: { id: seatId },
			include: { reservation: true }
		})

		if (!seat) {
			return false
		}

		// Si está marcado como reservado definitivamente
		if (seat.isReserved) {
			return false
		}

		// Si tiene una reserva confirmada
		if (seat.reservation && seat.reservation.status === 'confirmed') {
			return false
		}

		// Si tiene una reserva pendiente, verificar si ha expirado
		if (seat.reservation && seat.reservation.status === 'pending') {
			const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)
			if (seat.reservation.createdAt < thirtyMinutesAgo) {
				// La reserva ha expirado, eliminarla
				await prisma.reservation.delete({
					where: { id: seat.reservation.id }
				})
				return true
			}
			return false // Reserva pendiente válida
		}

		return true // Asiento disponible
	} catch (error) {
		return false
	}
}

/**
 * Obtiene el tiempo restante de una reserva pendiente en minutos
 * @param reservationId - ID de la reserva
 * @returns Minutos restantes o null si no aplica
 */
export async function getReservationTimeRemaining(reservationId: string): Promise<number | null> {
	try {
		const reservation = await prisma.reservation.findUnique({
			where: { id: reservationId }
		})

		if (!reservation || reservation.status !== 'pending') {
			return null
		}

		const expirationTime = new Date(reservation.createdAt.getTime() + 30 * 60 * 1000)
		const now = new Date()
		
		if (now >= expirationTime) {
			return 0 // Ya expiró
		}

		return Math.ceil((expirationTime.getTime() - now.getTime()) / (60 * 1000))
	} catch (error) {
		return null
	}
} 