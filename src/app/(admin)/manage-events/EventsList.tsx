'use client'
import { useEffect, useState } from 'react'
import { Event } from '@prisma/client'
import { getAllEvents } from './data-access'
import { EventCard } from '@/app/(user)/events/components/event-card'

export default function EventsList({ deleteMode }: { deleteMode: boolean }) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    // Cargar eventos al montar y cuando se elimina uno
    const fetchEvents = async () => {
        setLoading(true)
        const evts = await getAllEvents()
        setEvents(evts)
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

    return (
        <div className="relative">
            {success && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500/80 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-500">
                    Evento eliminado correctamente
                </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map(event => (
                    <EventCard
                        key={event.id}
                        event={event}
                        deleteMode={deleteMode}
                        onDeleted={handleEventDeleted}
                    />
                ))}
            </div>
        </div>
    )
}
