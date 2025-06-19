export function SkeletonComponent() {
	return (
		<div className="min-h-screen bg-deep-night">
			<div className="container mx-auto px-6 py-8">
				{/* Header Skeleton */}
				<div className="mb-8">
					<div className="h-8 bg-soft-gray/30 rounded-lg w-64 mb-4 animate-pulse" />
					<div className="h-4 bg-soft-gray/20 rounded w-96 animate-pulse" />
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Seat Map Skeleton */}
					<div className="lg:col-span-2">
						<div className="bg-soft-gray/20 backdrop-blur-sm rounded-2xl border border-soft-gray/20 p-8">
							{/* Screen */}
							<div className="h-4 bg-soft-gray/30 rounded-full w-full mb-12 animate-pulse" />
							
							{/* Circular Seat Map */}
							<div className="relative flex items-center justify-center">
								<div className="w-96 h-96 bg-soft-gray/20 rounded-full animate-pulse flex items-center justify-center">
									<div className="w-64 h-64 bg-soft-gray/30 rounded-full animate-pulse" />
								</div>
							</div>

							{/* Legend */}
							<div className="flex justify-center gap-6 mt-8">
								{[1, 2, 3, 4].map((i) => (
									<div key={i} className="flex items-center gap-2">
										<div className="w-4 h-4 bg-soft-gray/30 rounded-full animate-pulse" />
										<div className="h-4 bg-soft-gray/20 rounded w-16 animate-pulse" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar Skeleton */}
					<div className="space-y-6">
						{/* Event Info */}
						<div className="bg-soft-gray/20 backdrop-blur-sm rounded-2xl border border-soft-gray/20 p-6">
							<div className="h-6 bg-soft-gray/30 rounded w-32 mb-4 animate-pulse" />
							<div className="h-4 bg-soft-gray/20 rounded w-full mb-2 animate-pulse" />
							<div className="h-4 bg-soft-gray/20 rounded w-3/4 animate-pulse" />
						</div>

						{/* Selection Summary */}
						<div className="bg-soft-gray/20 backdrop-blur-sm rounded-2xl border border-soft-gray/20 p-6">
							<div className="h-6 bg-soft-gray/30 rounded w-40 mb-4 animate-pulse" />
							<div className="space-y-3">
								<div className="h-4 bg-soft-gray/20 rounded w-full animate-pulse" />
								<div className="h-4 bg-soft-gray/20 rounded w-2/3 animate-pulse" />
							</div>
							<div className="h-12 bg-soft-gray/30 rounded-lg w-full mt-6 animate-pulse" />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 