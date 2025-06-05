import { DataAccess } from './components/data-access'

interface EventDetailPageProps {
  params: { id: string }
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-deep-night to-black/90 py-12 px-4">
      <DataAccess id={params.id} />
    </div>
  )
} 