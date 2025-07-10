'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, MapPin, Users, Film, Search, X, Clock, Tag, Edit3 } from 'lucide-react'
import { getEventWithSeats, updateEvent } from '../../data-access'
import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

type TMDbMovie = {
    id: number
    title: string
    overview: string
    poster_path: string | null
    release_date: string
    vote_average: number
}

type EventData = {
    id: string
    title: string
    description: string | null
    dateTime: Date
    location: string
    imdbId: string | null
    tmdbId: string | null
    category: string | null
    imageUrl: string | null
    seatDistribution: {
        puffXXLEstelar: number
        reposeraDeluxe: number
        banquito: number
    }
}

const CATEGORIES = [
    'Acción',
    'Aventura', 
    'Ciencia ficción',
    'Superhéroes',
    'Terror',
    'Comedia',
    'Drama',
    'Romance',
    'Suspenso',
    'Animación',
    'Documental',
    'Musical'
]

const LOCATIONS = [
    'Terraza Principal',
    'Jardín Norte', 
    'Patio Sur',
    'Azotea Premium',
    'Área Familiar'
]

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
    const [eventId, setEventId] = useState<string>('')
    const [form, setForm] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: '',
        imdbId: '',
        tmdbId: '',
        category: ''
    })
    const [seatDistribution, setSeatDistribution] = useState({
        puffXXLEstelar: 6,
        reposeraDeluxe: 10,
        banquito: 14
    })
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [distributionError, setDistributionError] = useState<string | null>(null)
    const [selectedMovie, setSelectedMovie] = useState<TMDbMovie | null>(null)
    const [hasReservations, setHasReservations] = useState(false)

    // Modal y búsqueda
    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<TMDbMovie[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searching, setSearching] = useState(false)

    // Initialize params
    useEffect(() => {
        params.then(resolvedParams => {
            setEventId(resolvedParams.id)
        })
    }, [params])

    // Load event data
    useEffect(() => {
        if (!eventId) return

        async function loadEventData() {
            try {
                setInitialLoading(true)
                const result = await getEventWithSeats(eventId)
                
                if (!result.success || !result.event) {
                    throw new Error(result.error || 'Error al cargar el evento')
                }

                const event = result.event
                
                // Set form data
                setForm({
                    title: event.title,
                    description: event.description || '',
                    dateTime: new Date(event.dateTime).toISOString().slice(0, 16),
                    location: event.location,
                    imdbId: event.imdbId || '',
                    tmdbId: event.tmdbId || '',
                    category: event.category || ''
                })

                // Set seat distribution
                setSeatDistribution(event.seatDistribution)

                // Check if event has reservations
                setHasReservations(event._count.reservations > 0)

                // Load movie data if tmdbId exists
                if (event.tmdbId) {
                    try {
                        const movieRes = await fetch(
                            `https://api.themoviedb.org/3/movie/${event.tmdbId}?api_key=${tmdbApiKey}`
                        )
                        const movieData = await movieRes.json()
                        setSelectedMovie({
                            id: movieData.id,
                            title: movieData.title,
                            overview: movieData.overview,
                            poster_path: movieData.poster_path,
                            release_date: movieData.release_date,
                            vote_average: movieData.vote_average
                        })
                    } catch (err) {
                        console.log('No se pudo cargar información de la película:', err)
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el evento')
            } finally {
                setInitialLoading(false)
            }
        }

        loadEventData()
    }, [eventId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleDistributionChange = (membershipType: keyof typeof seatDistribution, value: number) => {
        const newDistribution = { ...seatDistribution, [membershipType]: value }
        setSeatDistribution(newDistribution)
        
        // Validar que la suma sea exactamente 30
        const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0)
        if (total !== 30) {
            setDistributionError(`La suma actual es ${total}. Debe ser exactamente 30 asientos.`)
        } else {
            setDistributionError(null)
        }
    }

    // Obtiene películas populares de TMDb
    const fetchPopularMovies = async (pageNum = 1) => {
        setSearching(true)
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/popular?api_key=${tmdbApiKey}&page=${pageNum}`
            )
            const data = await res.json()
            if (pageNum === 1) {
                setTotalPages(data.total_pages)
            }
            setResults(Array.isArray(data.results) ? data.results : [])
            setPage(data.page)
        } catch (err) {
            console.error('Error al obtener películas populares:', err)
            setResults([])
        }
        setSearching(false)
    }

    const openModal = async () => {
        setModalOpen(true)
        setSearch('')
        setResults([])
        setPage(1)
        setTotalPages(1)
        await fetchPopularMovies(1)
    }

    const closeModal = () => {
        setModalOpen(false)
    }

    const handleSearch = async (pageNum = 1) => {
        if (!search.trim()) return
        setSearching(true)
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(search)}&page=${pageNum}`
        )
        const data = await res.json()
        if (pageNum === 1) {
            setTotalPages(data.total_pages)
        }
        setResults(Array.isArray(data.results) ? data.results : [])
        setPage(data.page)
        setSearching(false)
    }

    const handleSelectMovie = async (movie: TMDbMovie) => {
        setSelectedMovie(movie)
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}`
            )
            const data = await res.json()
            setForm(prev => ({ 
                ...prev, 
                imdbId: data.imdb_id || '',
                title: movie.title 
            }))
        } catch (err) {
            console.log('No se pudo obtener imdb_id:', err)
            setForm(prev => ({ 
                ...prev, 
                imdbId: '',
                title: movie.title 
            }))
        }
        setModalOpen(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        if (!selectedMovie) {
            setError('Debes seleccionar una película antes de actualizar el evento.')
            setLoading(false)
            return
        }

        // Validar distribución de asientos
        const total = Object.values(seatDistribution).reduce((sum, val) => sum + val, 0)
        if (total !== 30) {
            setError(`La distribución de asientos debe sumar exactamente 30. Suma actual: ${total}`)
            setLoading(false)
            return
        }

        try {
            // Obtener imagen de TMDB automáticamente
            const imageUrl = selectedMovie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                : null

            const result = await updateEvent(eventId, {
                ...form,
                title: selectedMovie.title,
                tmdbId: selectedMovie.id.toString(),
                imageUrl,
                seatDistribution
            })

            if (!result.success) throw new Error(result.error || 'Error al actualizar el evento')

            // Mostrar mensaje de éxito
            setSuccess(true)
            if (result.hasReservations && !result.seatsUpdated) {
                console.log('⚠️ Evento actualizado. Los asientos no se modificaron debido a reservas existentes.')
            } else if (result.seatsUpdated) {
                console.log('✅ Evento y asientos actualizados correctamente')
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido')
        } finally {
            setLoading(false)
        }
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-deep-night via-soft-gray/30 to-deep-night flex items-center justify-center">
                <GlassCard className="p-8">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin" />
                        <span className="text-soft-beige">Cargando evento...</span>
                    </div>
                </GlassCard>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-deep-night via-soft-gray/30 to-deep-night">
            {/* Header */}
            <div className="pt-28 pb-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Link
                            href="/manage-events"
                            className="flex items-center gap-2 text-soft-beige/70 hover:text-sunset-orange transition-colors mr-6"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Volver a Eventos</span>
                        </Link>
                    </div>
                    
                    <div className="text-center mb-8">
                        <h1 className="text-display text-4xl md:text-5xl text-soft-beige mb-4 flex items-center justify-center gap-3">
                            <Edit3 className="w-8 h-8 md:w-10 md:h-10 text-sunset-orange" />
                            Editar Evento
                        </h1>
                        <p className="text-soft-beige/70 text-lg">
                            Modifica los detalles de esta experiencia cinematográfica
                        </p>
                    </div>
                </div>
            </div>

            {/* Warning for events with reservations */}
            {hasReservations && (
                <div className="max-w-4xl mx-auto px-6 mb-6">
                    <GlassCard variant="glow" className="p-4 border-sunset-orange">
                        <div className="flex items-center gap-3 text-sunset-orange">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-medium">
                                Este evento tiene reservas activas. La distribución de asientos no se podrá modificar.
                            </span>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
                    <GlassCard variant="glow" className="p-4 border-dark-olive">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-dark-olive">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-medium">¡Evento actualizado correctamente!</span>
                                <span className="text-soft-beige/70">|</span>
                                <Link
                                    href="/manage-events"
                                    className="hover:underline text-sunset-orange font-medium"
                                >
                                    Ver Eventos
                                </Link>
                            </div>
                        </div>
                    </GlassCard>
                </div>
            )}

            {/* Main Form */}
            <div className="max-w-4xl mx-auto px-6 pb-12">
                <form onSubmit={handleSubmit} className="space-y-8 admin-form">
                    {/* Error Message */}
                    {error && (
                        <GlassCard variant="glow" className="p-4 border-warm-red">
                            <div className="flex items-center gap-3 text-warm-red">
                                <X className="w-5 h-5" />
                                <span>{error}</span>
                            </div>
                        </GlassCard>
                    )}

                    {/* Información de la Película */}
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
                                <Film className="w-6 h-6 text-sunset-orange" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-soft-beige">
                                    Selección de Película
                                </h3>
                                <p className="text-soft-beige/70 text-sm">
                                    Busca y selecciona la película para el evento
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="button"
                                onClick={openModal}
                                variant="primary"
                                className="w-full flex items-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                {selectedMovie ? 'Cambiar Película' : 'Buscar Película'}
                            </Button>

                            {selectedMovie && (
                                <div className="p-4 rounded-xl bg-sunset-orange/10 border border-sunset-orange/20">
                                    <div className="flex items-center gap-4">
                                        {selectedMovie.poster_path && (
                                            <Image 
                                                src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`} 
                                                alt={selectedMovie.title} 
                                                width={48} 
                                                height={72} 
                                                className="w-12 h-18 rounded object-cover" 
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium text-soft-beige">{selectedMovie.title}</p>
                                            <p className="text-sm text-soft-beige/70">
                                                {selectedMovie.release_date?.slice(0, 4)} • ⭐ {selectedMovie.vote_average.toFixed(1)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </GlassCard>

                    {/* Información Básica */}
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
                                <Tag className="w-6 h-6 text-sunset-orange" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-soft-beige">
                                    Información Básica
                                </h3>
                                <p className="text-soft-beige/70 text-sm">
                                    Detalles descriptivos del evento
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Categoría
                                </label>
                                <select
                                    name="category"
                                    value={form.category}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                    style={{ 
                                        backgroundColor: 'rgba(58, 58, 60, 0.1)',
                                        color: 'var(--soft-beige)',
                                        border: '1px solid rgba(58, 58, 60, 0.2)'
                                    }}
                                >
                                    <option value="" style={{ backgroundColor: 'var(--deep-night)', color: 'var(--soft-beige)' }}>Seleccionar categoría</option>
                                    {CATEGORIES.map(category => (
                                        <option key={category} value={category} style={{ backgroundColor: 'var(--deep-night)', color: 'var(--soft-beige)' }}>{category}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Describe la experiencia del evento..."
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50 resize-none"
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {/* Detalles Logísticos */}
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
                                <Calendar className="w-6 h-6 text-sunset-orange" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-soft-beige">
                                    Detalles Logísticos
                                </h3>
                                <p className="text-soft-beige/70 text-sm">
                                    Fecha, hora y ubicación del evento
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Fecha y Hora
                                </label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/50" />
                                    <input
                                        type="datetime-local"
                                        name="dateTime"
                                        value={form.dateTime}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Ubicación
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/50" />
                                    <select
                                        name="location"
                                        value={form.location}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                                        style={{ 
                                            backgroundColor: 'rgba(58, 58, 60, 0.1)',
                                            color: 'var(--soft-beige)',
                                            border: '1px solid rgba(58, 58, 60, 0.2)'
                                        }}
                                    >
                                        <option value="" style={{ backgroundColor: 'var(--deep-night)', color: 'var(--soft-beige)' }}>Seleccionar ubicación</option>
                                        {LOCATIONS.map(location => (
                                            <option key={location} value={location} style={{ backgroundColor: 'var(--deep-night)', color: 'var(--soft-beige)' }}>{location}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    {/* Distribución de Asientos */}
                    <GlassCard className="p-6">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-sunset-orange/20 rounded-lg flex items-center justify-center mr-4">
                                <Users className="w-6 h-6 text-sunset-orange" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-soft-beige">
                                    Distribución de Asientos
                                </h3>
                                <p className="text-soft-beige/70 text-sm">
                                    Configuración de asientos por tipo de membresía (Total: 30 asientos)
                                    {hasReservations && (
                                        <span className="block text-sunset-orange text-xs mt-1">
                                            ⚠️ No se puede modificar debido a reservas existentes
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {/* Error de distribución */}
                        {distributionError && !hasReservations && (
                            <div className="mb-4 p-3 rounded-xl bg-warm-red/10 border border-warm-red/20">
                                <div className="flex items-center gap-2 text-warm-red text-sm">
                                    <X className="w-4 h-4" />
                                    <span>{distributionError}</span>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Puff XXL Estelar */}
                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Puff XXL Estelar
                                    <span className="text-xs text-soft-beige/50 block">Premium - Fila frontal</span>
                                </label>
                                <input
                                    type="number"
                                    value={seatDistribution.puffXXLEstelar}
                                    onChange={(e) => handleDistributionChange('puffXXLEstelar', parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="30"
                                    disabled={hasReservations}
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Reposera Deluxe */}
                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Reposera Deluxe
                                    <span className="text-xs text-soft-beige/50 block">Intermedio - Fila media</span>
                                </label>
                                <input
                                    type="number"
                                    value={seatDistribution.reposeraDeluxe}
                                    onChange={(e) => handleDistributionChange('reposeraDeluxe', parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="30"
                                    disabled={hasReservations}
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            {/* Banquito */}
                            <div>
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Banquito
                                    <span className="text-xs text-soft-beige/50 block">Básico - Fila trasera</span>
                                </label>
                                <input
                                    type="number"
                                    value={seatDistribution.banquito}
                                    onChange={(e) => handleDistributionChange('banquito', parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="30"
                                    disabled={hasReservations}
                                    className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Suma total */}
                        <div className="mt-4 p-4 rounded-xl bg-sunset-orange/10 border border-sunset-orange/20">
                            <div className="flex justify-between items-center">
                                <span className="text-soft-beige font-medium">Total de asientos:</span>
                                <span className={`text-xl font-bold ${
                                    Object.values(seatDistribution).reduce((sum, val) => sum + val, 0) === 30 
                                        ? 'text-dark-olive' 
                                        : 'text-warm-red'
                                }`}>
                                    {Object.values(seatDistribution).reduce((sum, val) => sum + val, 0)} / 30
                                </span>
                            </div>
                        </div>

                        {/* Vista previa de imagen automática */}
                        {selectedMovie && selectedMovie.poster_path && (
                            <div className="mt-6">
                                <label className="block text-soft-beige/70 font-medium mb-2">
                                    Imagen del Evento (desde TMDB)
                                </label>
                                <div className="w-32 h-48 rounded-xl overflow-hidden border border-soft-gray/20">
                                    <Image 
                                        src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                                        alt={selectedMovie.title}
                                        width={128}
                                        height={192}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-xs text-soft-beige/50 mt-2">
                                    Esta imagen se usará automáticamente para el evento
                                </p>
                            </div>
                        )}
                    </GlassCard>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            disabled={loading || !selectedMovie || (!hasReservations && Object.values(seatDistribution).reduce((sum, val) => sum + val, 0) !== 30)}
                            loading={loading}
                            size="lg"
                            className="min-w-[200px]"
                        >
                            {loading ? 'Actualizando Evento...' : 'Actualizar Evento'}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Movie Search Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <GlassCard className="w-full max-w-4xl max-h-[80vh] mx-4 p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-soft-beige">Buscar Película</h2>
                            <Button
                                type="button"
                                onClick={closeModal}
                                variant="outline"
                                size="sm"
                                className="p-2"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="flex gap-3 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-beige/50" />
                                <input
                                    type="text"
                                    placeholder="Nombre de la película..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(1)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50"
                                />
                            </div>
                            <Button
                                type="button"
                                onClick={() => handleSearch(1)}
                                disabled={searching}
                                loading={searching}
                            >
                                Buscar
                            </Button>
                        </div>

                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {searching && (
                                <div className="text-center py-8">
                                    <div className="w-8 h-8 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    <p className="text-soft-beige/70">Buscando películas...</p>
                                </div>
                            )}
                            
                            {!searching && results.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-soft-beige/70">No se encontraron resultados</p>
                                </div>
                            )}
                            
                            <div className="grid gap-3">
                                {results.map(movie => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleSelectMovie(movie)}
                                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-soft-gray/10 cursor-pointer transition-all group border border-transparent hover:border-sunset-orange/20"
                                    >
                                        <Image 
                                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                                            alt={movie.title} 
                                            width={48} 
                                            height={72} 
                                            className="w-12 h-18 rounded object-cover" 
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-soft-beige group-hover:text-sunset-orange transition-colors">
                                                {movie.title}
                                            </h3>
                                            <p className="text-sm text-soft-beige/70 mb-1">
                                                {movie.release_date?.slice(0, 4)} • ⭐ {movie.vote_average.toFixed(1)}
                                            </p>
                                            <p className="text-xs text-soft-beige/60 line-clamp-2">
                                                {movie.overview}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-soft-gray/20">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (search.trim()) {
                                            handleSearch(page - 1)
                                        } else {
                                            fetchPopularMovies(page - 1)
                                        }
                                    }}
                                    disabled={page <= 1 || searching}
                                    variant="outline"
                                    size="sm"
                                >
                                    Anterior
                                </Button>
                                
                                <span className="text-soft-beige/70">
                                    Página {page} de {totalPages}
                                </span>
                                
                                <Button
                                    type="button"
                                    onClick={() => {
                                        if (search.trim()) {
                                            handleSearch(page + 1)
                                        } else {
                                            fetchPopularMovies(page + 1)
                                        }
                                    }}
                                    disabled={page >= totalPages || searching}
                                    variant="outline"
                                    size="sm"
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </GlassCard>
                </div>
            )}
        </div>
    )
} 