'use client'

import { useState } from 'react'
import { createEvent } from '../data-access'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY

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
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

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

    // Abre el modal y muestra películas populares
    const openModal = async () => {
        setModalOpen(true)
        setSearch('')
        setResults([])
        setPage(1)
        setTotalPages(1)
        await fetchPopularMovies(1)
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
            `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(search)}&page=${pageNum}`
        )
        const data = await res.json()
        console.log('Resultados de búsqueda:', data)
        if (!Array.isArray(data.results)) {
            console.error('Error en la respuesta de TMDb:', data)
        }
        if (pageNum === 1) {
            setTotalPages(data.total_pages)
        }
        setResults(Array.isArray(data.results) ? data.results : [])
        setPage(data.page)
        setSearching(false)
    }

    // Selecciona película y cierra modal
    const handleSelectMovie = async (movie: any) => {
        setSelectedMovie(movie)
        console.log('Película seleccionada:', movie)
        // Intentar obtener el imdb_id, pero no mostrar error si no existe
        try {
            const res = await fetch(
                `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${tmdbApiKey}`
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

    // Maneja la selección de imagen y muestra preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        } else {
            setImageFile(null)
            setImagePreview(null)
        }
    }

    // Modifica handleSubmit para subir la imagen después de crear el evento
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        // Validar que haya una película seleccionada
        if (!selectedMovie) {
            setError('Debes seleccionar una película antes de crear el evento.')
            setLoading(false)
            return
        }

        try {
            // El título del evento será el nombre de la película seleccionada
            const result = await createEvent({
                ...form,
                title: selectedMovie.title,
            })

            if (!result.success) throw new Error(result.error || 'Error al crear el evento')

            // Si hay imagen, sube la imagen y actualiza el evento
            if (imageFile) {
                // Aquí deberías subir la imagen y obtener la URL pública
                // const imageUrl = await uploadImage(imageFile)
                // await updateEventImage(result.event.id, imageUrl)
            }

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
            setImageFile(null)
            setImagePreview(null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center relative">

            {success && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center w-full max-w-lg pointer-events-none">
                    <div className="flex flex-col items-center gap-2 bg-green-500/90 backdrop-blur-md text-white px-6 py-4 rounded-xl shadow-lg border border-green-300/80 mb-2 pointer-events-auto animate-fade-in">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-lg">¡Evento creado correctamente!</span>
                            <Link
                                href="/manage-events"
                                className="hover:underline cursor-pointer text-white"
                            >
                                Ver Eventos
                            </Link>
                        </div>
                    </div>
                </div>
            )
            }
            <form
                onSubmit={handleSubmit}
                className="bg-gray-800/80 p-8 rounded-lg shadow-lg max-w-lg w-full space-y-4 border border-gray-700"
            >

                <h1 className="text-2xl font-bold text-white mb-4">Añadir Nuevo Evento</h1>
                {/* Botón para abrir el modal de búsqueda */}
                <div>
                    <Link
                        href="/manage-events"
                        className="absolute left-4 top-20 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                    >
                        <ArrowLeft className="w-8 h-8" />
                    </Link>
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
                                    onClick={() => {
                                        if (search.trim()) {
                                            handleSearch(page - 1)
                                        } else {
                                            fetchPopularMovies(page - 1)
                                        }
                                    }}
                                    disabled={page <= 1 || searching}
                                    className="bg-gray-700 text-white hover:bg-gray-800 transition-all dration-200 px-3 py-1 rounded disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <span className="text-white">{page} / {totalPages}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (search.trim()) {
                                            handleSearch(page + 1)
                                        } else {
                                            fetchPopularMovies(page + 1)
                                        }
                                    }}
                                    disabled={page >= totalPages || searching}
                                    className="bg-gray-700 text-white hover:bg-gray-800  transition-all dration-200 px-3 py-1 rounded disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Selector de imagen con mejor UI */}
                <div className="flex flex-col items-center mb-4">
                    <label className="block text-white font-semibold mb-2">Imagen del evento (opcional)</label>
                    <label
                        htmlFor="event-image"
                        className="w-40 h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-gray-900 hover:border-orange-500 transition-all"
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <span className="text-gray-400 text-center">
                                Seleccionar Imagen<br />
                                <span className="text-xs text-gray-500">(JPG, PNG, etc.)</span>
                            </span>
                        )}
                    </label>
                    <input
                        id="event-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded transition"
                >
                    {loading ? 'Guardando...' : 'Añadir Evento'}
                </button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
            </form>
        </div >
    )
}