export function EventDetailSkeletonComponent() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-8">
					{/* Hero Image */}
					<div className="aspect-video bg-soft-gray/30 rounded-xl animate-pulse" />
					
					{/* Title and Info */}
					<div className="space-y-4">
						<div className="h-8 bg-soft-gray/30 rounded w-3/4 animate-pulse" />
						<div className="h-4 bg-soft-gray/30 rounded w-1/2 animate-pulse" />
						<div className="flex space-x-4">
							<div className="h-4 bg-soft-gray/30 rounded w-24 animate-pulse" />
							<div className="h-4 bg-soft-gray/30 rounded w-32 animate-pulse" />
						</div>
					</div>
					
					{/* Description */}
					<div className="space-y-3">
						<div className="h-6 bg-soft-gray/30 rounded w-32 animate-pulse" />
						<div className="space-y-2">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="h-4 bg-soft-gray/30 rounded animate-pulse" />
							))}
							<div className="h-4 bg-soft-gray/30 rounded w-3/4 animate-pulse" />
						</div>
					</div>
					
					{/* Trailer Section */}
					<div className="space-y-4">
						<div className="h-6 bg-soft-gray/30 rounded w-24 animate-pulse" />
						<div className="aspect-video bg-soft-gray/30 rounded-xl animate-pulse" />
					</div>
				</div>
				
				{/* Sidebar */}
				<div className="space-y-6">
					{/* Booking Card */}
					<div className="bg-soft-gray/30 rounded-xl p-6 space-y-4 animate-pulse">
						<div className="h-6 bg-soft-gray/50 rounded w-32" />
						<div className="h-4 bg-soft-gray/50 rounded w-24" />
						<div className="h-12 bg-soft-gray/50 rounded-lg" />
					</div>
					
					{/* Event Details */}
					<div className="bg-soft-gray/30 rounded-xl p-6 space-y-4 animate-pulse">
						<div className="h-6 bg-soft-gray/50 rounded w-40" />
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex justify-between">
									<div className="h-4 bg-soft-gray/50 rounded w-20" />
									<div className="h-4 bg-soft-gray/50 rounded w-24" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 