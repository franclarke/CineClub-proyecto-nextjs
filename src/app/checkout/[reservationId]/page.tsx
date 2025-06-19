import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DataAccess } from './components/DataAccess'

interface CheckoutPageProps {
	params: Promise<{
		reservationId: string
	}>
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Checkout | Puff & Chill',
		description: 'Completa tu reserva y pago'
	}
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
	const { reservationId } = await params
	
	if (!reservationId) {
		notFound()
	}

	return <DataAccess reservationId={reservationId} />
} 