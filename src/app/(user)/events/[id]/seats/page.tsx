import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DataAccess } from './components/DataAccess'

interface SeatMapPageProps {
	params: {
		id: string
	}
}

export async function generateMetadata({ params }: SeatMapPageProps): Promise<Metadata> {
	return {
		title: `Asientos para evento ${params.id} | Puff & Chill`,
		description: 'Elige tu asiento perfecto para esta experiencia de cine bajo las estrellas'
	}
}

export default function SeatMapPage({ params }: SeatMapPageProps) {
	const { id } = params
	
	if (!id) {
		notFound()
	}

	return (
		<main className="min-h-screen bg-deep-night pt-28 pb-12">
			<DataAccess eventId={id} />
		</main>
	)
} 