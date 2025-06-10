import Navigation from '../../components/Navigation'
import { Suspense } from 'react'
import EventsList from './EventsList'
import Link from 'next/link'
import { Home } from 'lucide-react'

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header del admin */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mt-12 mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Home className="h-7 w-7 text-orange-500" />
                                <h1 className="text-2xl font-bold text-white">Gestionar Eventos</h1>
                            </div>
                            <Link href="/dashboard/events/new">
                                <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-5 rounded transition shadow">
                                    Añadir Nuevo Evento
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Contenido de eventos */}
                <Suspense fallback={<div className="text-white">Cargando eventos...</div>}>
                    <EventsList />
                </Suspense>
            </div>
        </div>
    )
}