import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SeatMapClient } from './SeatMapClient'

interface DataAccessProps {
	eventId: string
}

export async function DataAccess({ eventId }: DataAccessProps) {
	const session = await getServerSession(authOptions)
	
	// Si no hay sesión, redirigir al inicio para autenticarse
	if (!session?.user) {
		redirect('/')
	}

	// Limpiar reservas pendientes expiradas para este evento
	const { cleanupExpiredReservations } = await import('@/lib/utils/reservations')
	await cleanupExpiredReservations(eventId)

	// Get event with seats
	const event = await prisma.event.findUnique({
		where: { id: eventId },
		include: {
			seats: {
				include: {
					reservation: {
						include: {
							user: {
								include: {
									membership: true
								}
							}
						}
					}
				},
				orderBy: {
					seatNumber: 'asc'
				}
			}
		}
	})

	if (!event) {
		notFound()
	}

	// Get user's membership
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		include: {
			membership: true
		}
	})

	if (!user) {
		// Si el usuario autenticado no existe en la base de datos
		// Esto puede ocurrir después de un reset de la base de datos
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 text-center">
				<h2 className="text-2xl font-bold text-warm-red mb-4">
					Sesión Expirada
				</h2>
				<p className="text-soft-beige/70 mb-4">
					Tu sesión ha expirado o tu usuario ya no existe en el sistema.
				</p>
				<p className="text-soft-beige/70 mb-8">
					Por favor, cierra sesión e inicia sesión nuevamente.
				</p>
				<div className="space-y-4">
					<Link
						href="/api/auth/signout" 
						className="btn-primary inline-block"
					>
						Cerrar Sesión
					</Link>
					<div>
						<Link
							href="/" 
							className="text-soft-beige/70 hover:text-soft-beige transition-colors"
						>
							Volver al inicio
						</Link>
					</div>
				</div>
			</div>
		)
	}

	// Check if event is in the past
	const isEventPast = new Date(event.dateTime) < new Date()
	
	if (isEventPast) {
		// En lugar de 404, mostrar un mensaje más claro
		return (
			<div className="max-w-4xl mx-auto px-4 py-12 text-center">
				<h2 className="text-2xl font-bold text-soft-beige mb-4">
					Evento Finalizado
				</h2>
				<p className="text-soft-beige/70 mb-8">
					Este evento ya ha finalizado y no es posible reservar asientos.
				</p>
				<Link
					href="/events" 
					className="btn-primary inline-block"
				>
					Ver eventos disponibles
				</Link>
			</div>
		)
	}

	return (
		<SeatMapClient 
			event={event}
			currentUser={user}
		/>
	)
} 