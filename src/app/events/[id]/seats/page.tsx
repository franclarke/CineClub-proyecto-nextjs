import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DataAccess } from './components/DataAccess'

interface SeatMapPageProps {
	params: {
		id: string
	}
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Seleccionar Asientos | Puff & Chill',
		description: 'Elige tu asiento perfecto para esta experiencia de cine bajo las estrellas'
	}
}

export default async function SeatMapPage({ params }: SeatMapPageProps) {
	if (!params.id) {
		notFound()
	}

	return <DataAccess eventId={params.id} />
} 