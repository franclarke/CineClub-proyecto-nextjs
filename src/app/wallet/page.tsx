import { Metadata } from 'next'
import { DataAccess } from './components/DataAccess'

export const metadata: Metadata = {
	title: 'Mi Wallet | Puff & Chill',
	description: 'Gestiona tus tickets y productos comprados'
}

export default async function WalletPage() {
	return 
	<DataAccess />
} 