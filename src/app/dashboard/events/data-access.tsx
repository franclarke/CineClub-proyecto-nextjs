'use server'
import { prisma } from '@/lib/prisma'

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
    spotifyUri?: string
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
                spotifyUri: form.spotifyUri || null,
                category: form.category || null,
            },
        })
        return { success: true, event }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}