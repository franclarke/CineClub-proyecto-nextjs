import { DataAccess } from './components/data-access'

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className='min-h-screen bg-gradient-to-br from-deep-night to-black/90 py-12 px-4'>
			<DataAccess id={id} />
		</div>
	)
} 