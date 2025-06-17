export function EventsSkeletonComponent() {
	return (
		<div className="space-y-8">
			{/* Filters Skeleton */}
			<div className="flex flex-wrap gap-4 justify-center">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-10 w-32 bg-soft-gray/30 rounded-lg animate-pulse" />
				))}
			</div>

			{/* Events Grid Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="bg-soft-gray/30 rounded-xl overflow-hidden animate-pulse">
						{/* Image placeholder */}
						<div className="h-64 bg-soft-gray/50" />
						
						{/* Content */}
						<div className="p-6 space-y-4">
							{/* Title */}
							<div className="h-6 bg-soft-gray/50 rounded w-3/4" />
							
							{/* Date */}
							<div className="h-4 bg-soft-gray/50 rounded w-1/2" />
							
							{/* Description */}
							<div className="space-y-2">
								<div className="h-4 bg-soft-gray/50 rounded" />
								<div className="h-4 bg-soft-gray/50 rounded w-5/6" />
							</div>
							
							{/* Button */}
							<div className="h-10 bg-soft-gray/50 rounded-lg w-full" />
						</div>
					</div>
				))}
			</div>
		</div>
	)
} 