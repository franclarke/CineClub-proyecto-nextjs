export function EventDetailSkeletonComponent() {
	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
			{/* Back Button Skeleton */}
			<div className="mb-8">
				<div className="flex items-center space-x-2">
					<div className="w-5 h-5 bg-soft-gray/20 rounded" />
					<div className="w-32 h-4 bg-soft-gray/20 rounded" />
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-8">
					{/* Hero Section Skeleton */}
					<div className="relative">
						<div className="aspect-video bg-gradient-to-br from-sunset-orange/20 to-warm-red/20 rounded-xl overflow-hidden flex items-center justify-center relative">
							{/* Loading placeholder */}
							<div className="w-24 h-24 bg-soft-gray/30 rounded-full flex items-center justify-center">
								<div className="w-12 h-12 bg-soft-gray/40 rounded-full" />
							</div>

							{/* Date Badge Skeleton */}
							<div className="absolute top-4 left-4 bg-deep-night/80 backdrop-blur-sm rounded-lg px-3 py-2">
								<div className="w-6 h-6 bg-soft-gray/30 rounded mb-1" />
								<div className="w-8 h-3 bg-soft-gray/30 rounded" />
							</div>

							{/* Availability Badge Skeleton */}
							<div className="absolute top-4 right-4">
								<div className="w-24 h-8 bg-warm-red/30 rounded-lg" />
							</div>
						</div>
					</div>

					{/* Title and Basic Info Skeleton */}
					<div className="space-y-4">
						<div className="flex flex-wrap items-center gap-3 mb-4">
							<div className="w-16 h-6 bg-sunset-orange/20 rounded-full" />
							<div className="w-20 h-6 bg-soft-gold/20 rounded-full" />
						</div>

						<div className="w-3/4 h-12 bg-soft-gray/30 rounded" />

						<div className="flex flex-wrap items-center gap-6">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-soft-gray/20 rounded" />
								<div className="w-16 h-4 bg-soft-gray/20 rounded" />
							</div>
							<div className="w-32 h-4 bg-soft-gray/20 rounded" />
							<div className="w-12 h-4 bg-soft-gray/20 rounded" />
						</div>

						<div className="flex flex-wrap items-center gap-6">
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-soft-gray/20 rounded" />
								<div className="w-24 h-4 bg-soft-gray/20 rounded" />
							</div>
							<div className="flex items-center space-x-2">
								<div className="w-4 h-4 bg-soft-gray/20 rounded" />
								<div className="w-20 h-4 bg-soft-gray/20 rounded" />
							</div>
						</div>
					</div>

					{/* Description Skeleton */}
					<div className="space-y-4">
						<div className="w-24 h-6 bg-soft-gray/30 rounded" />
						<div className="space-y-3">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="h-4 bg-soft-gray/20 rounded" />
							))}
							<div className="h-4 bg-soft-gray/20 rounded w-3/4" />
						</div>
					</div>

					{/* Trailer Section Skeleton */}
					<div className="space-y-4">
						<div className="w-16 h-6 bg-soft-gray/30 rounded" />
						<div className="aspect-video bg-soft-gray/20 rounded-xl flex items-center justify-center">
							<div className="w-16 h-16 bg-soft-gray/30 rounded-full flex items-center justify-center">
								<div className="w-8 h-8 bg-soft-gray/40 rounded-full" />
							</div>
						</div>
					</div>

					{/* Additional Info Skeleton */}
					<div className="space-y-4">
						<div className="w-32 h-6 bg-soft-gray/30 rounded" />
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{[...Array(4)].map((_, i) => (
								<div key={i} className="bg-soft-gray/10 rounded-lg p-4">
									<div className="w-20 h-4 bg-soft-gray/20 rounded mb-2" />
									<div className="w-16 h-5 bg-soft-gray/20 rounded" />
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Booking Card Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="space-y-4">
							<div className="w-32 h-6 bg-soft-gray/20 rounded" />
							<div className="w-24 h-4 bg-soft-gray/20 rounded" />
							
							{/* Availability Info Skeleton */}
							<div className="bg-soft-gray/10 rounded-lg p-3">
								<div className="flex items-center justify-between mb-2">
									<div className="w-20 h-4 bg-soft-gray/20 rounded" />
									<div className="w-12 h-4 bg-soft-gray/20 rounded" />
								</div>
								<div className="w-full bg-soft-gray/30 rounded-full h-2 mb-2" />
								<div className="flex justify-between">
									<div className="w-16 h-3 bg-soft-gray/20 rounded" />
									<div className="w-12 h-3 bg-soft-gray/20 rounded" />
								</div>
							</div>

							<div className="h-12 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-xl" />
						</div>
					</div>

					{/* Event Details Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="w-32 h-6 bg-soft-gray/20 rounded mb-4" />
						<div className="space-y-4">
							{[...Array(6)].map((_, i) => (
								<div key={i} className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 bg-soft-gray/20 rounded" />
										<div className="w-16 h-4 bg-soft-gray/20 rounded" />
									</div>
									<div className="w-20 h-4 bg-soft-gray/20 rounded" />
								</div>
							))}
						</div>
					</div>

					{/* Seat Tiers Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="w-28 h-6 bg-soft-gray/20 rounded mb-4" />
						<div className="space-y-3">
							{[...Array(3)].map((_, i) => (
								<div key={i} className="flex items-center justify-between p-3 bg-soft-gray/10 rounded-lg">
									<div className="flex items-center gap-3">
										<div className="w-6 h-6 bg-soft-gray/20 rounded" />
										<div className="w-12 h-4 bg-soft-gray/20 rounded" />
									</div>
									<div className="w-8 h-4 bg-soft-gray/20 rounded" />
								</div>
							))}
						</div>
					</div>

					{/* Related Events Skeleton */}
					<div className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="w-32 h-6 bg-soft-gray/20 rounded mb-4" />
						<div className="space-y-3">
							{[...Array(2)].map((_, i) => (
								<div key={i} className="flex gap-3">
									<div className="w-16 h-12 bg-soft-gray/20 rounded" />
									<div className="flex-1 space-y-2">
										<div className="w-full h-4 bg-soft-gray/20 rounded" />
										<div className="w-2/3 h-3 bg-soft-gray/20 rounded" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 