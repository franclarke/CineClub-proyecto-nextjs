import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DataAccess } from './components/DataAccess'

interface SeatMapPageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({ params }: SeatMapPageProps): Promise<Metadata> {
	const { id } = await params
	return {
		title: `Asientos para evento ${id} | Puff & Chill`,
		description: 'Elige tu asiento perfecto para esta experiencia de cine bajo las estrellas'
	}
}

export default async function SeatMapPage({ params }: SeatMapPageProps) {
	const { id } = await params
	
	if (!id) {
		notFound()
	}

	return (
		<main className="pt-20">
			<DataAccess eventId={id} />
		</main>
	)
} 