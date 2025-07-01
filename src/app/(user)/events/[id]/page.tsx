import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EventDetailDataAccess } from './components/EventDetailDataAccess'
import { EventDetailSkeletonComponent } from './components/EventDetailSkeletonComponent'

interface EventDetailPageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Evento | Puff & Chill',
		description: 'Descubre los detalles de este evento único de cine bajo las estrellas'
	}
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
	const { id } = await params
	
	if (!id) {
		notFound()
	}

	return (
		<>
			<main className="min-h-screen bg-deep-night pt-28 pb-12">
				<Suspense fallback={<EventDetailSkeletonComponent />}>
					<EventDetailDataAccess eventId={id} />
				</Suspense>
			</main>
		</>
	)
} 