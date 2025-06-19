export default function EventDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-soft-gray/20 h-80 rounded-xl" />
        <div className="space-y-4">
          <div className="bg-soft-gray/20 h-8 w-2/3 rounded" />
          <div className="bg-soft-gray/20 h-4 rounded" />
          <div className="bg-soft-gray/20 h-4 rounded" />
          <div className="bg-soft-gray/20 h-10 w-1/2 rounded mt-8" />
        </div>
      </div>
    </div>
  )
} 