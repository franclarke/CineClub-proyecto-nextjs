'use client'
import { useEffect, useState } from 'react'
import { getAllEvents } from './data-access'
import AdminEventsTable from './components/AdminEventsTable'

export default function EventsList({ deleteMode }: { deleteMode: boolean }) {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    // Cargar eventos
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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mr-3" />
                <span className="text-soft-beige">Cargando eventos...</span>
            </div>
        )
    }

    return (
        <div className="relative">
            {success && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-dark-olive text-soft-beige px-6 py-3 rounded-xl shadow-soft z-50 transition-all duration-500 border border-dark-olive/30">
                    <div className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        Evento eliminado correctamente
                    </div>
                </div>
            )}
            <AdminEventsTable
                events={events}
                deleteMode={deleteMode}
                onEventDeleted={handleEventDeleted}
            />
        </div>
    )
}
