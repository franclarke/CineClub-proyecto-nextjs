import { Suspense } from 'react'
import { Metadata } from 'next'
import Navigation from '../components/Navigation'
import { EventsSkeletonComponent } from './components/EventsSkeletonComponent'
import { EventsDataAccess } from './components/EventsDataAccess'

interface EventsPageProps {
	searchParams: Promise<{
		category?: string
		sort?: 'date' | 'popular' | 'name'
		search?: string
	}>
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Eventos | Puff & Chill',
		description: 'Descubre nuestras próximas experiencias de cine bajo las estrellas'
	}
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
	const resolvedSearchParams = await searchParams
	
	return (
		<>
			<Navigation />
			<main className="min-h-screen bg-deep-night pt-20 pb-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h1 className="text-display text-4xl md:text-6xl text-soft-beige mb-4">
							Próximas Funciones
						</h1>
						<p className="text-xl text-soft-beige/80">
							Descubre tu próxima experiencia cinematográfica bajo las estrellas
						</p>
					</div>

					<Suspense fallback={<EventsSkeletonComponent />}>
						<EventsDataAccess searchParams={resolvedSearchParams} />
					</Suspense>
				</div>
			</main>
		</>
	)
} 