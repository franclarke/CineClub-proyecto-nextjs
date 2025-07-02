export default function EventsLoading() {
  return (
    <div className="container mx-auto px-4 py-20 animate-pulse">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-soft-gray/20 h-64 rounded-xl" />
        ))}
      </div>
    </div>
  )
} 
