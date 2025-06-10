'use client'

import Navigation from '@/app/components/Navigation'
import { useState } from 'react'
import { createEvent } from '../data-access' // Asegúrate que la ruta sea correcta

const TMDB_API_KEY = 'TU_API_KEY' // Reemplaza por tu API Key de TMDb

export default function NewEventPage() {
    const [form, setForm] = useState({
        title: '',
        description: '',
        dateTime: '',
        location: '',
        imdbId: '',
        spotifyUri: '',
        category: '',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<any>(null)

    // Modal y búsqueda
    const [modalOpen, setModalOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [searching, setSearching] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    // Abre el modal y resetea búsqueda
    const openModal = () => {
        setModalOpen(true)
        setSearch('')
        setResults([])
        setPage(1)
        setTotalPages(1)
    }

    // Cierra el modal
    const closeModal = () => {
        setModalOpen(false)
    }

    // Busca películas en TMDb
    const handleSearch = async (pageNum = 1) => {
        if (!search.trim()) return
        setSearching(true)
        console.log('Buscando películas:', search, 'Página:', pageNum)
        const res = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}&page=${pageNum}`
        )
        const data = await res.json()
        console.log('Resultados de búsqueda:', data)
        setResults(data.results)
        setPage(data.page)
        setTotalPages(data.total_pages)
        setSearching(false)
    }

    // Selecciona película y cierra modal
    const handleSelectMovie = async (movie: any) => {
        setSelectedMovie(movie)
        console.log('Película seleccionada:', movie)
        // Intentar obtener el imdb_id, pero no mostrar error si no existe
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`
            )
            const data = await res.json()
            console.log('Detalles de la película seleccionada:', data)
            setForm(prev => ({ ...prev, imdbId: data.imdb_id || '' }))
        } catch (err) {
            console.log('No se pudo obtener imdb_id:', err)
            setForm(prev => ({ ...prev, imdbId: '' }))
        }
        setModalOpen(false)
    }

    // Usa createEvent de data-access en vez de fetch
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)
        console.log('Enviando formulario:', form)
        try {
            const result = await createEvent(form)
            console.log('Resultado de createEvent:', result)
            if (!result.success) throw new Error(result.error || 'Error al crear el evento')
            setSuccess(true)
            setForm({
                title: '',
                description: '',
                dateTime: '',
                location: '',
                imdbId: '',
                spotifyUri: '',
                category: '',
            })
            setSelectedMovie(null)
        } catch (err: any) {
            console.log('Error al crear el evento:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center">
            <Navigation />
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800/80 p-8 rounded-lg shadow-lg max-w-lg w-full space-y-4 border border-gray-700"
            >
                <h1 className="text-2xl font-bold text-white mb-4">Añadir Nuevo Evento</h1>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />
                <input
                    type="datetime-local"
                    name="dateTime"
                    placeholder="Fecha y hora"
                    value={form.dateTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="Ubicación"
                    value={form.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Categoría (opcional)"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
                />

                {/* Botón para abrir el modal de búsqueda */}
                <div>
                    <button
                        type="button"
                        onClick={openModal}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition mb-2"
                    >
                        {selectedMovie ? 'Cambiar Película' : 'Buscar Película'}
                    </button>
                    {selectedMovie && (
                        <div className="mt-2 p-2 rounded bg-gray-700">
                            <strong className="text-white">Seleccionado:</strong> {selectedMovie.title}
                        </div>
                    )}
                </div>

                {/* Modal de búsqueda */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
                            <button
                                onClick={closeModal}
                                className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl"
                                aria-label="Cerrar"
                            >
                                ×
                            </button>
                            <h2 className="text-xl font-bold text-white mb-4">Buscar Película</h2>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    placeholder="Nombre de la película"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch(1)}
                                    className="flex-1 p-2 rounded bg-gray-900 text-white border border-gray-700"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleSearch(1)}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition"
                                    disabled={searching}
                                >
                                    Buscar
                                </button>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {searching && <div className="text-white">Buscando...</div>}
                                {!searching && results.length === 0 && <div className="text-gray-400">No hay resultados.</div>}
                                {results.map(movie => (
                                    <div
                                        key={movie.id}
                                        onClick={() => handleSelectMovie(movie)}
                                        className="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                                    >
                                        <img src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} alt={movie.title} className="w-16 h-24 rounded-md mr-2" />
                                        <div className="flex-1">
                                            <span className="text-white font-semibold">{movie.title}</span>
                                            <br />
                                            <span className="text-gray-400 text-sm">{movie.release_date?.slice(0, 4)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Paginado */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    type="button"
                                    onClick={() => handleSearch(page - 1)}
                                    disabled={page <= 1 || searching}
                                    className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <span className="text-white">{page} / {totalPages}</span>
                                <button
                                    type="button"
                                    onClick={() => handleSearch(page + 1)}
                                    disabled={page >= totalPages || searching}
                                    className="bg-gray-700 text-white px-3 py-1 rounded disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    {loading ? 'Guardando...' : 'Añadir Evento'}
                </button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                {success && <div className="text-green-500 text-sm">¡Evento creado correctamente!</div>}
            </form>
        </div>
    )
}