'use client'
import { useEffect, useState } from 'react'
import { EventsClientComponent } from '@/app/(user)/events/components/EventsClientComponent'
import { getAllEvents } from './data-access'
import type { Seat } from '@prisma/client'

export default function EventsList({ deleteMode }: { deleteMode: boolean }) {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)
    const [categories, setCategories] = useState<string[]>([])
    const [filters, setFilters] = useState({
        category: 'all',
        sort: 'date',
        search: '',
    })

    // Cargar eventos y categorías
    const fetchEvents = async () => {
        setLoading(true)
        const evts = await getAllEvents()
        setEvents(evts)

        // Obtener categorías únicas
        const uniqueCategories = Array.from(
            new Set(evts.map(event => event.category).filter((c): c is string => !!c))
        ).sort()
        setCategories(uniqueCategories)
        setLoading(false)
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    // Handler para cuando se elimina un evento
    const handleEventDeleted = async () => {
        setSuccess(true)
        await fetchEvents()
        setTimeout(() => setSuccess(false), 2000)
    }

    if (loading) return <div className="text-white">Cargando eventos...</div>

    // Formatear datos para el componente cliente
    const formattedEvents = events.map(event => ({
        ...event,
        dateTime: typeof event.dateTime === 'string' ? event.dateTime : event.dateTime?.toISOString?.() ?? '',
        deleteMode,
        onDeleted: handleEventDeleted,
        seatsByTier: {
            gold: event.seats?.filter?.((seat: Seat) => seat.tier === 'Gold').length ?? 0,
            silver: event.seats?.filter?.((seat: Seat) => seat.tier === 'Silver').length ?? 0,
            bronze: event.seats?.filter?.((seat: Seat) => seat.tier === 'Bronze').length ?? 0,
        },
    }))

    return (
        <div className="relative">
            {success && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500/80 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-500">
                    Evento eliminado correctamente
                </div>
            )}
            <EventsClientComponent
                events={formattedEvents}
                categories={categories}
                currentFilters={filters}
            />
        </div>
    )
}
