'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Search, Calendar, MapPin, Users, Edit2, Trash2, Filter } from 'lucide-react'
import Link from 'next/link'

interface Event {
    id: string
    title: string
    description?: string
    dateTime: string | Date
    location: string
    category?: string
    totalSeats: number
    availableSeats: number
    reservationCount: number
    imageUrl?: string
}

interface AdminEventsTableProps {
    events: Event[]
    deleteMode: boolean
    onEventDeleted?: () => void
}

export default function AdminEventsTable({ events, deleteMode, onEventDeleted }: AdminEventsTableProps) {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'sold-out' | 'upcoming'>('all')
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'reservations'>('date')

    // Helper function to get event status
    const getEventStatus = (event: Event) => {
        const eventDate = new Date(event.dateTime)
        const now = new Date()
        
        if (eventDate < now) return 'past'
        if (event.availableSeats === 0) return 'sold-out'
        if (eventDate > now) return 'upcoming'
        return 'active'
    }

    // Helper function to format date
    const formatDate = (dateTime: string | Date) => {
        const date = new Date(dateTime)
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Filter and sort events
    const filteredEvents = events
        .filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) ||
                                event.location.toLowerCase().includes(search.toLowerCase())
            
            if (!matchesSearch) return false
            
            if (filterStatus === 'all') return true
            
            const status = getEventStatus(event)
            return filterStatus === status
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'date':
                    return new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
                case 'title':
                    return a.title.localeCompare(b.title)
                case 'reservations':
                    return b.reservationCount - a.reservationCount
                default:
                    return 0
            }
        })

    const handleDelete = async (eventId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return
        
        try {
            const response = await fetch(`/api/events/${eventId}`, {
                method: 'DELETE'
            })
            
            if (response.ok) {
                onEventDeleted?.()
            } else {
                alert('Error al eliminar el evento')
            }
        } catch (error) {
            console.error('Error deleting event:', error)
            alert('Error al eliminar el evento')
        }
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Buscar eventos..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-beige/50" />
                </div>

                {/* Status Filter */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                >
                    <option value="all" className="bg-deep-night text-soft-beige">Todos los estados</option>
                    <option value="upcoming" className="bg-deep-night text-soft-beige">Próximos</option>
                    <option value="active" className="bg-deep-night text-soft-beige">Activos</option>
                    <option value="sold-out" className="bg-deep-night text-soft-beige">Agotados</option>
                </select>

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                >
                    <option value="date" className="bg-deep-night text-soft-beige">Ordenar por fecha</option>
                    <option value="title" className="bg-deep-night text-soft-beige">Ordenar por título</option>
                    <option value="reservations" className="bg-deep-night text-soft-beige">Ordenar por reservas</option>
                </select>
            </div>

            {/* Events Table */}
            <div className="card-modern overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-soft-gray/5">
                            <tr>
                                <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Evento
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Fecha y Ubicación
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Ocupación
                                    </div>
                                </th>
                                <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                    Estado
                                </th>
                                <th className="py-4 px-6 text-center font-semibold text-soft-beige border-b border-soft-gray/20">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-soft-beige/70">
                                        <div className="flex flex-col items-center gap-3">
                                            <Calendar className="w-12 h-12 text-soft-beige/30" />
                                            <p>No hay eventos que coincidan con los filtros.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredEvents.map((event) => {
                                    const status = getEventStatus(event)
                                    const occupancyPercentage = event.totalSeats > 0 
                                        ? Math.round(((event.totalSeats - event.availableSeats) / event.totalSeats) * 100)
                                        : 0

                                    return (
                                        <tr
                                            key={event.id}
                                            className="hover:bg-soft-gray/5 transition-colors"
                                        >
                                            {/* Event Info */}
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div>
                                                    <h3 className="font-semibold text-soft-beige line-clamp-1">
                                                        {event.title}
                                                    </h3>
                                                    {event.category && (
                                                        <span className="text-xs text-sunset-orange">
                                                            {event.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Date and Location */}
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div className="text-sm">
                                                    <div className="text-soft-beige font-medium">
                                                        {formatDate(event.dateTime)}
                                                    </div>
                                                    <div className="text-soft-beige/70">
                                                        {event.location}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Occupancy */}
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div className="text-sm">
                                                    <div className="text-soft-beige font-medium">
                                                        {event.totalSeats - event.availableSeats}/{event.totalSeats}
                                                    </div>
                                                    <div className="w-full bg-soft-gray/20 rounded-full h-2 mt-1">
                                                        <div 
                                                            className="bg-sunset-orange h-2 rounded-full transition-all"
                                                            style={{ width: `${occupancyPercentage}%` }}
                                                        />
                                                    </div>
                                                    <div className="text-xs text-soft-beige/70 mt-1">
                                                        {occupancyPercentage}% ocupado
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <span className={`
                                                    px-3 py-1 rounded-full text-xs font-semibold border inline-block
                                                    ${status === 'sold-out' ? 'bg-warm-red/20 text-warm-red border-warm-red/30' :
                                                      status === 'upcoming' ? 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30' :
                                                      status === 'active' ? 'bg-dark-olive/20 text-dark-olive border-dark-olive/30' :
                                                      'bg-soft-gray/20 text-soft-gray border-soft-gray/30'}
                                                `}>
                                                    {status === 'sold-out' ? 'Agotado' :
                                                     status === 'upcoming' ? 'Próximo' :
                                                     status === 'active' ? 'Activo' : 'Pasado'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        asChild
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Link href={`/manage-events/edit/${event.id}`}>
                                                            <Edit2 className="w-4 h-4" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                    
                                                    {deleteMode && (
                                                        <Button
                                                            onClick={() => handleDelete(event.id)}
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex items-center gap-1 border-warm-red text-warm-red hover:bg-warm-red/10"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Eliminar
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            {filteredEvents.length > 0 && (
                <div className="flex justify-between items-center text-sm text-soft-beige/70">
                    <span>
                        Mostrando {filteredEvents.length} de {events.length} eventos
                    </span>
                    <span>
                        Total de reservas: {filteredEvents.reduce((sum, event) => sum + event.reservationCount, 0)}
                    </span>
                </div>
            )}
        </div>
    )
} 