import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DataAccess } from './components/DataAccess'

interface CheckoutPageProps {
	params: {
		reservationId: string
	}
}

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: 'Checkout | Puff & Chill',
		description: 'Completa tu reserva y pago'
	}
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
	if (!params.reservationId) {
		notFound()
	}

	return <DataAccess reservationId={params.reservationId} />
} 