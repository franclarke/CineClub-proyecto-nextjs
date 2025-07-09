'use server'
import webpush from 'web-push'
import { prisma } from "@/lib/prisma"

webpush.setVapidDetails(
    'mailto:tu@email.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY!
)

export async function notifyAllUsersAboutNewEvent(eventTitle: string) {
    const subscriptions = await prisma.pushSubscription.findMany()
    const payload = JSON.stringify({
        title: '¡Nuevo evento disponible!',
        body: `Se ha creado el evento: ${eventTitle}`,
        icon: '/icon-192x192.png'
    })
    for (const subscription of subscriptions) {
        try {
            await webpush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: subscription.keys as { p256dh: string; auth: string }
                },
                payload
            )
        } catch (error) {
            console.error('Error al enviar notificación:', error)
        }
    }
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
 * Crea un nuevo evento en la base de datos.
 */
export async function createEvent(form: {
    title: string
    description: string
    dateTime: string
    location: string
    imdbId?: string
    tmdbId?: string
    category?: string
}) {
    try {
        const event = await prisma.event.create({
            data: {
                title: form.title,
                description: form.description,
                dateTime: new Date(form.dateTime),
                location: form.location,
                imdbId: form.imdbId || null,
                tmdbId: form.tmdbId || null,
                category: form.category || null,
            },
        })
        await notifyAllUsersAboutNewEvent(event.title)
        return { success: true, event }
    } catch (error) {
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
