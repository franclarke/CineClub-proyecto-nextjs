import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Navigation from '../../components/Navigation'
import { EventDetailSkeletonComponent } from './components/EventDetailSkeletonComponent'
import { EventDetailDataAccess } from './components/EventDetailDataAccess'

interface EventDetailPageProps {
	params: {
		id: string
	}
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
	if (!params.id) {
		notFound()
	}

	return (
		<>
			<Navigation />
			<main className="min-h-screen bg-deep-night pt-20 pb-12">
				<Suspense fallback={<EventDetailSkeletonComponent />}>
					<EventDetailDataAccess eventId={params.id} />
				</Suspense>
			</main>
		</>
	)
} 