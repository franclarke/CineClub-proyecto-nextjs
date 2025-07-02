export function EventsSkeletonComponent() {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Compact Filter Bar Skeleton */}
			<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-4">
				<div className="flex items-center justify-between">
					{/* Search Bar Skeleton */}
					<div className="flex-1 max-w-md">
						<div className="h-10 bg-soft-gray/20 rounded-xl" />
					</div>
					
					{/* Filter Controls Skeleton */}
					<div className="flex items-center space-x-3 ml-4">
						<div className="h-10 w-24 bg-soft-gray/20 rounded-xl" />
						<div className="h-10 w-20 bg-soft-gray/20 rounded-xl" />
						<div className="h-10 w-16 bg-soft-gray/20 rounded-xl" />
					</div>
				</div>
			</div>

			{/* Active Filters Tags Skeleton */}
			<div className="flex flex-wrap gap-2">
				{[...Array(2)].map((_, i) => (
					<div key={i} className="w-20 h-7 bg-sunset-orange/20 rounded-full" />
				))}
			</div>

			{/* Events Grid Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[...Array(6)].map((_, i) => (
					<div key={i} className="bg-deep-night/60 backdrop-blur-xl border border-soft-gray/20 rounded-2xl overflow-hidden">
						{/* Header Image Skeleton */}
						<div className="h-48 bg-soft-gray/20 relative">
							{/* Date Badge Skeleton */}
							<div className="absolute top-3 left-3 w-12 h-12 bg-soft-gray/30 rounded-xl" />
							
							{/* Category Badge Skeleton */}
							<div className="absolute bottom-3 left-3 w-16 h-6 bg-soft-gray/30 rounded-lg" />
							
							{/* Availability Badge Skeleton */}
							<div className="absolute top-3 right-3 w-24 h-6 bg-warm-red/30 rounded-lg" />
						</div>
						
						{/* Content Skeleton */}
						<div className="p-6 space-y-4">
							{/* Title and Info Skeleton */}
							<div className="space-y-2">
								<div className="h-6 bg-soft-gray/30 rounded w-3/4" />
								<div className="h-4 bg-soft-gray/20 rounded w-full" />
								<div className="h-4 bg-soft-gray/20 rounded w-2/3" />
							</div>
							
							{/* Event Details Skeleton */}
							<div className="space-y-3">
								{[...Array(3)].map((_, j) => (
									<div key={j} className="flex items-center gap-3">
										<div className="w-5 h-5 bg-soft-gray/30 rounded" />
										<div className="h-4 bg-soft-gray/20 rounded flex-1" />
									</div>
								))}
							</div>
							
							{/* Availability Section Skeleton */}
							<div className="bg-soft-gray/10 border border-soft-gray/20 rounded-xl p-4">
								<div className="flex items-center justify-between mb-3">
									<div className="flex items-center gap-2">
										<div className="w-5 h-5 bg-soft-gray/30 rounded" />
										<div className="h-4 bg-soft-gray/20 rounded w-20" />
									</div>
									<div className="text-right">
										<div className="h-4 bg-soft-gray/20 rounded w-12 mb-1" />
										<div className="h-3 bg-soft-gray/20 rounded w-16" />
									</div>
								</div>
								<div className="w-full bg-soft-gray/30 rounded-full h-2 mb-2" />
								<div className="flex justify-between">
									<div className="h-3 bg-soft-gray/20 rounded w-16" />
									<div className="h-3 bg-soft-gray/20 rounded w-12" />
								</div>
							</div>
							
							{/* Seat Tiers Skeleton */}
							<div className="flex gap-2">
								{[...Array(3)].map((_, k) => (
									<div key={k} className="flex-1 bg-soft-gray/10 rounded-lg p-2 text-center">
										<div className="h-3 bg-soft-gray/20 rounded w-8 mx-auto mb-1" />
										<div className="h-4 bg-soft-gray/20 rounded w-6 mx-auto" />
									</div>
								))}
							</div>
							
							{/* Button Skeleton */}
							<div className="h-12 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-xl w-full" />
						</div>
					</div>
				))}
			</div>

			{/* Results Summary Skeleton */}
			<div className="flex items-center justify-between pt-4 border-t border-soft-gray/20">
				<div className="h-4 bg-soft-gray/20 rounded w-32" />
				<div className="flex items-center space-x-6">
					<div className="h-4 bg-soft-gray/20 rounded w-24" />
					<div className="h-4 bg-soft-gray/20 rounded w-20" />
				</div>
			</div>
		</div>
	)
} 
