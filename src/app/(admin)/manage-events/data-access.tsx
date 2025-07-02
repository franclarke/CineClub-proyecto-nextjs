'use server'

import { prisma } from "@/lib/prisma"

/**
 * Obtiene todos los eventos desde la base de datos.
 */
export async function getAllEvents() {
    return prisma.event.findMany({
        orderBy: { dateTime: 'asc' },
        include: {
            _count: {
                select: { reservations: true },
            },
        },
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
