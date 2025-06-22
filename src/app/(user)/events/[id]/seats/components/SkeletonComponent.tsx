export function SkeletonComponent() {
	return (
		<div className="max-w-7xl pt-28 mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
			{/* Back Button Skeleton */}
			<div className="mb-8">
				<div className="flex items-center space-x-2">
					<div className="w-5 h-5 bg-soft-gray/20 rounded" />
					<div className="w-32 h-4 bg-soft-gray/20 rounded" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Seat Map Skeleton */}
				<div className="lg:col-span-2">
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-8">
						{/* Screen */}
						<div className="mb-12 text-center">
							<div className="w-full h-3 bg-gradient-to-r from-transparent via-soft-gold/30 to-transparent rounded-full mb-2" />
							<div className="w-16 h-4 bg-soft-gray/20 rounded mx-auto" />
						</div>
						
						{/* Amphitheater Seat Map Skeleton */}
						<div className="relative w-full max-w-4xl mx-auto">
							<div className="space-y-4">
								{/* Simulate amphitheater rows */}
								{[...Array(8)].map((_, rowIndex) => (
									<div key={rowIndex} className="relative">
										{/* Row label */}
										<div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
											<div className="w-8 h-6 bg-soft-gray/20 rounded" />
										</div>
										
										{/* Seats in row */}
										<div className="flex justify-center items-center gap-2">
											{[...Array(8 + rowIndex)].map((_, seatIndex) => (
												<div
													key={seatIndex}
													className="w-9 h-9 bg-soft-gray/20 rounded-lg animate-pulse"
													style={{ 
														animationDelay: `${(rowIndex * 8 + seatIndex) * 0.05}s`,
														width: rowIndex < 3 ? '2.75rem' : rowIndex < 5 ? '2.5rem' : '2.25rem',
														height: rowIndex < 3 ? '2.75rem' : rowIndex < 5 ? '2.5rem' : '2.25rem'
													}}
												/>
											))}
										</div>
									</div>
								))}
							</div>

							{/* Distance indicators */}
							<div className="mt-8 flex justify-center">
								<div className="flex space-x-6">
									<div className="w-32 h-3 bg-soft-gray/20 rounded" />
									<div className="w-32 h-3 bg-soft-gray/20 rounded" />
								</div>
							</div>
						</div>

						{/* Legend Skeleton */}
						<div className="flex justify-center gap-6 mt-8">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-gray/30 rounded-lg" />
									<div className="h-4 bg-soft-gray/20 rounded w-16" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Sidebar Skeleton */}
				<div className="space-y-6">
					{/* Event Info Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-soft-gray/20 rounded-xl" />
							<div className="w-32 h-6 bg-soft-gray/20 rounded" />
						</div>
						<div className="space-y-3">
							<div className="h-5 bg-soft-gray/20 rounded w-full" />
							<div className="h-4 bg-soft-gray/20 rounded w-3/4" />
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-soft-gray/20 rounded" />
								<div className="h-4 bg-soft-gray/20 rounded w-24" />
							</div>
							<div className="flex items-center gap-2">
								<div className="w-4 h-4 bg-soft-gray/20 rounded" />
								<div className="h-4 bg-soft-gray/20 rounded w-20" />
							</div>
						</div>
					</div>

					{/* Selection Summary Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-soft-gray/20 rounded-xl" />
							<div className="w-40 h-6 bg-soft-gray/20 rounded" />
						</div>
						<div className="space-y-4">
							<div className="bg-soft-gray/10 rounded-lg p-3">
								<div className="h-4 bg-soft-gray/20 rounded w-32 mb-2" />
								<div className="h-3 bg-soft-gray/20 rounded w-24" />
							</div>
							<div className="space-y-2">
								<div className="flex justify-between">
									<div className="h-4 bg-soft-gray/20 rounded w-16" />
									<div className="h-4 bg-soft-gray/20 rounded w-12" />
								</div>
								<div className="flex justify-between">
									<div className="h-4 bg-soft-gray/20 rounded w-20" />
									<div className="h-4 bg-soft-gray/20 rounded w-16" />
								</div>
								<div className="border-t border-soft-gray/20 pt-2">
									<div className="flex justify-between">
										<div className="h-5 bg-soft-gray/20 rounded w-12" />
										<div className="h-5 bg-soft-gray/20 rounded w-16" />
									</div>
								</div>
							</div>
							<div className="h-12 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-xl w-full" />
						</div>
					</div>

					{/* Membership Benefits Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-8 h-8 bg-soft-gold/20 rounded-xl" />
							<div className="w-36 h-6 bg-soft-gray/20 rounded" />
						</div>
						<div className="space-y-3">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="flex items-center gap-3">
									<div className="w-4 h-4 bg-soft-gold/20 rounded-full" />
									<div className="h-4 bg-soft-gray/20 rounded flex-1" />
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 