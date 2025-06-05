import { DataAccess } from './components/data-access'

export default function EventDetailPage({ params }: { params: { id: string } }) {
	return (
		<div className='min-h-screen bg-gradient-to-br from-deep-night to-black/90 py-12 px-4'>
			<DataAccess id={params.id} />
		</div>
	)
} 