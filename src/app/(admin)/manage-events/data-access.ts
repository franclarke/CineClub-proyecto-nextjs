'use server'
import webpush from 'web-push'
import { prisma } from "@/lib/prisma"

// Configurar webpush solo si las variables de entorno están disponibles
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:tu@email.com',
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY
    )
} else {
    console.warn('⚠️  Variables de entorno VAPID no configuradas - Push notifications deshabilitadas')
}

export async function notifyAllUsersAboutNewEvent(event: {
    title: string;
    dateTime: Date;
    location: string;
}) {
    // Verificar si webpush está configurado
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY) {
        console.log('⚠️  Push notifications no configuradas - saltando notificaciones')
        return
    }

    const subscriptions = await prisma.pushSubscription.findMany()

    if (subscriptions.length === 0) {
        console.log('No hay usuarios suscritos a notificaciones push')
        return
    }

    // Formatear la fecha para mostrar en español
    const eventDate = new Date(event.dateTime)
    const formattedDate = eventDate.toLocaleDateString('es-AR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
    const formattedTime = eventDate.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
    })

    const payload = JSON.stringify({
        title: `🎬 Nueva película: ${event.title}`,
        body: `${formattedDate} a las ${formattedTime} en ${event.location}. ¡Reservá tu lugar ahora!`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: '/events'
        }
    })

    const sendPromises = subscriptions.map(async (subscription) => {
        try {
            await webpush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: subscription.keys as { p256dh: string; auth: string }
                },
                payload
            )
            return { success: true }
        } catch (error) {
            console.error('Error al enviar notificación:', error)

            // Si la suscripción es inválida, la eliminamos
            if ((error as any)?.statusCode === 410 || (error as any)?.statusCode === 403) {
                try {
                    await prisma.pushSubscription.delete({
                        where: { id: subscription.id }
                    })
                    console.log('Suscripción inválida eliminada:', subscription.endpoint)
                } catch (deleteError) {
                    console.error('Error eliminando suscripción inválida:', deleteError)
                }
            }
            return { success: false }
        }
    })

    const results = await Promise.all(sendPromises)
    const successCount = results.filter(r => r.success).length
    console.log(`Notificaciones push enviadas: ${successCount}/${subscriptions.length}`)
}

/**
 * Obtiene todos los eventos desde la base de datos.
 */
export async function getAllEvents() {
    const events = await prisma.event.findMany({
        orderBy: { dateTime: 'asc' },
        include: {
            _count: {
                select: { reservations: true },
            },
            seats: {
                select: {
                    id: true,
                    tier: true,
                    isReserved: true,
                }
            }
        },
    })

    // Calculate additional properties for UI compatibility
    return events.map(event => {
        const totalSeats = event.seats.length
        const availableSeats = event.seats.filter(seat => !seat.isReserved).length
        const reservationCount = event._count.reservations

        // Calculate seats by tier
        const seatsByTier = {
            'Puff XXL Estelar': event.seats.filter(seat => seat.tier === 'Oro').length,
            'Reposera Deluxe': event.seats.filter(seat => seat.tier === 'Plata').length,
            'Banquito': event.seats.filter(seat => seat.tier === 'Bronce').length,
        }

        // Calculate available tiers
        const availableTiers = []
        if (event.seats.some(seat => seat.tier === 'Oro' && !seat.isReserved)) {
            availableTiers.push('Puff XXL Estelar')
        }
        if (event.seats.some(seat => seat.tier === 'Plata' && !seat.isReserved)) {
            availableTiers.push('Reposera Deluxe')
        }
        if (event.seats.some(seat => seat.tier === 'Bronce' && !seat.isReserved)) {
            availableTiers.push('Banquito')
        }

        // Basic price info (could be enhanced with actual pricing logic)
        const priceInfo = {
            lowestPrice: 5000, // Default price, should be calculated from membership tiers
            tierPrices: {
                'Puff XXL Estelar': 8000,
                'Reposera Deluxe': 6000,
                'Banquito': 5000,
            },
            availableTiers,
        }

        return {
            ...event,
            totalSeats,
            availableSeats,
            reservationCount,
            seatsByTier,
            priceInfo,
        }
    })
}

/**
 * Obtiene un evento por su ID.
 */
export async function getEventById(id: string) {
    return prisma.event.findUnique({
        where: { id },
        include: {
            _count: {
                select: { reservations: true },
            },
        },
    })
}

/**
 * Crea un nuevo evento en la base de datos y sus asientos automáticamente.
 */
export async function createEvent(form: {
    title: string
    description: string
    dateTime: string
    location: string
    imdbId?: string
    tmdbId?: string
    category?: string
    imageUrl?: string | null
    seatDistribution: {
        puffXXLEstelar: number
        reposeraDeluxe: number
        banquito: number
    }
}) {
    try {
        // Validar que la distribución sume exactamente 30
        const total = Object.values(form.seatDistribution).reduce((sum, val) => sum + val, 0)
        if (total !== 30) {
            throw new Error(`La distribución de asientos debe sumar 30. Suma actual: ${total}`)
        }

        // Crear el evento
        const event = await prisma.event.create({
            data: {
                title: form.title,
                description: form.description,
                dateTime: new Date(form.dateTime),
                location: form.location,
                imdbId: form.imdbId || null,
                tmdbId: form.tmdbId || null,
                category: form.category || null,
                imageUrl: form.imageUrl || null,
            },
        })

        // Crear asientos automáticamente basados en la distribución
        const seats = []
        let seatNumber = 1

        // Asientos Puff XXL Estelar (fila frontal VIP)
        for (let i = 0; i < form.seatDistribution.puffXXLEstelar; i++) {
            seats.push({
                eventId: event.id,
                seatNumber: seatNumber++,
                tier: 'Puff XXL Estelar',
            })
        }

        // Asientos Reposera Deluxe (fila media)
        for (let i = 0; i < form.seatDistribution.reposeraDeluxe; i++) {
            seats.push({
                eventId: event.id,
                seatNumber: seatNumber++,
                tier: 'Reposera Deluxe',
            })
        }

        // Asientos Banquito (fila trasera)
        for (let i = 0; i < form.seatDistribution.banquito; i++) {
            seats.push({
                eventId: event.id,
                seatNumber: seatNumber++,
                tier: 'Banquito',
            })
        }

        // Crear todos los asientos en la base de datos
        await prisma.seat.createMany({
            data: seats,
            skipDuplicates: true,
        })

        console.log(`✅ Evento creado con ${seats.length} asientos:`, {
            'Puff XXL Estelar': form.seatDistribution.puffXXLEstelar,
            'Reposera Deluxe': form.seatDistribution.reposeraDeluxe,
            'Banquito': form.seatDistribution.banquito
        })

        // Enviar notificación push automáticamente
        console.log('Enviando notificación push para el nuevo evento:', event.title)
        await notifyAllUsersAboutNewEvent({
            title: event.title,
            dateTime: event.dateTime,
            location: event.location
        })

        return { success: true, event, notificationSent: true, seatsCreated: seats.length }
    } catch (error) {
        console.error('Error al crear evento:', error)
        return { success: false, error: (error as Error).message }
    }
}
/**
 * Actualiza la imagen de un evento. Falta agregar fila a columna Events
 */
// export async function updateEventImage(eventId: string, imageUrl: string) {
//     try {
//         const event = await prisma.event.update({
//             where: { id: eventId },
//             data: { image: imageUrl },
//         })
//         return { success: true, event }
//     } catch (error) {
//         return { success: false, error: (error as Error).message }
//     }
// }

/**
 * Obtiene un evento por su ID con información detallada de asientos.
 */
export async function getEventWithSeats(id: string) {
    try {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                seats: {
                    select: {
                        id: true,
                        tier: true,
                        isReserved: true,
                        seatNumber: true,
                    }
                },
                _count: {
                    select: { reservations: true },
                },
            },
        })

        if (!event) {
            return { success: false, error: 'Evento no encontrado' }
        }

        // Calculate seat distribution
        const seatDistribution = {
            puffXXLEstelar: event.seats.filter(seat => seat.tier === 'Puff XXL Estelar').length,
            reposeraDeluxe: event.seats.filter(seat => seat.tier === 'Reposera Deluxe').length,
            banquito: event.seats.filter(seat => seat.tier === 'Banquito').length,
        }

        return {
            success: true,
            event: {
                ...event,
                seatDistribution
            }
        }
    } catch (error) {
        console.error('Error al obtener evento:', error)
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Actualiza un evento existente en la base de datos y regenera sus asientos si es necesario.
 */
export async function updateEvent(id: string, form: {
    title: string
    description: string
    dateTime: string
    location: string
    imdbId?: string
    tmdbId?: string
    category?: string
    imageUrl?: string | null
    seatDistribution: {
        puffXXLEstelar: number
        reposeraDeluxe: number
        banquito: number
    }
}) {
    try {
        // Validar que la distribución sume exactamente 30
        const total = Object.values(form.seatDistribution).reduce((sum, val) => sum + val, 0)
        if (total !== 30) {
            throw new Error(`La distribución de asientos debe sumar 30. Suma actual: ${total}`)
        }

        // Verificar si el evento existe
        const existingEvent = await prisma.event.findUnique({
            where: { id },
            include: {
                seats: {
                    where: { isReserved: true }
                }
            }
        })

        if (!existingEvent) {
            throw new Error('Evento no encontrado')
        }

        // Verificar si hay reservas activas antes de modificar asientos
        const hasReservations = existingEvent.seats.length > 0
        if (hasReservations) {
            console.warn('⚠️ Evento tiene reservas activas. Se actualizará la información pero no la distribución de asientos.')
        }

        // Actualizar el evento
        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                title: form.title,
                description: form.description,
                dateTime: new Date(form.dateTime),
                location: form.location,
                imdbId: form.imdbId || null,
                tmdbId: form.tmdbId || null,
                category: form.category || null,
                imageUrl: form.imageUrl || null,
            },
        })

        // Solo regenerar asientos si no hay reservas activas
        let seatsUpdated = false
        if (!hasReservations) {
            // Eliminar asientos existentes
            await prisma.seat.deleteMany({
                where: { eventId: id }
            })

            // Crear nuevos asientos basados en la distribución actualizada
            const seats = []
            let seatNumber = 1

            // Asientos Puff XXL Estelar (fila frontal VIP)
            for (let i = 0; i < form.seatDistribution.puffXXLEstelar; i++) {
                seats.push({
                    eventId: id,
                    seatNumber: seatNumber++,
                    tier: 'Puff XXL Estelar',
                })
            }

            // Asientos Reposera Deluxe (fila media)
            for (let i = 0; i < form.seatDistribution.reposeraDeluxe; i++) {
                seats.push({
                    eventId: id,
                    seatNumber: seatNumber++,
                    tier: 'Reposera Deluxe',
                })
            }

            // Asientos Banquito (fila trasera)
            for (let i = 0; i < form.seatDistribution.banquito; i++) {
                seats.push({
                    eventId: id,
                    seatNumber: seatNumber++,
                    tier: 'Banquito',
                })
            }

            // Crear todos los asientos en la base de datos
            await prisma.seat.createMany({
                data: seats,
                skipDuplicates: true,
            })

            seatsUpdated = true
            console.log(`✅ Asientos regenerados para evento ${updatedEvent.title}:`, {
                'Puff XXL Estelar': form.seatDistribution.puffXXLEstelar,
                'Reposera Deluxe': form.seatDistribution.reposeraDeluxe,
                'Banquito': form.seatDistribution.banquito
            })
        }

        return {
            success: true,
            event: updatedEvent,
            seatsUpdated,
            hasReservations
        }
    } catch (error) {
        console.error('Error al actualizar evento:', error)
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Elimina un evento y todos sus datos relacionados (asientos, reservas).
 */
export async function deleteEvent(id: string) {
    try {
        // Verificar si el evento existe
        const existingEvent = await prisma.event.findUnique({
            where: { id },
            include: {
                reservations: true,
                seats: true
            }
        })

        if (!existingEvent) {
            return { success: false, error: 'Evento no encontrado' }
        }

        // Usar una transacción para eliminar todo de forma segura
        await prisma.$transaction(async (tx) => {
            // 1. Eliminar reservas primero (debido a foreign keys)
            await tx.reservation.deleteMany({
                where: { eventId: id }
            })

            // 2. Eliminar asientos
            await tx.seat.deleteMany({
                where: { eventId: id }
            })

            // 3. Eliminar el evento
            await tx.event.delete({
                where: { id }
            })
        })

        console.log(`✅ Evento eliminado correctamente: ${existingEvent.title}`)
        return { success: true }
    } catch (error) {
        console.error('Error al eliminar evento:', error)
        return { success: false, error: (error as Error).message }
    }
}
