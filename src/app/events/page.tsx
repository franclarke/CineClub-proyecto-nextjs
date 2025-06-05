import { DataAccess } from './components/data-access'

export default async function EventsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const resolvedSearchParams = await searchParams
	return (
		<div className="min-h-screen bg-gradient-to-br from-deep-night to-black/90 py-8">
			<div className="container mx-auto px-4">
				<header className="text-center mb-8">
					<h1 className="text-display text-4xl md:text-6xl text-soft-beige mb-2">
						Próximos Eventos
					</h1>
					<p className="text-soft-beige/80 max-w-2xl mx-auto">
						Descubre nuestras sesiones de cine bajo las estrellas y reserva tu lugar
						antes de que se agoten.
					</p>
				</header>

				<DataAccess searchParams={resolvedSearchParams} />
			</div>
		</div>
	)
} 