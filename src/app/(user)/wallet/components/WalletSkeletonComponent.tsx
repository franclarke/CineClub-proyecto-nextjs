export function WalletSkeletonComponent() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Summary Cards Skeleton */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-2xl p-6"
					>
						<div className="flex items-center justify-between">
							<div className="flex-1">
								<div className="h-4 bg-soft-gray/20 rounded-lg mb-3 w-24"></div>
								<div className="h-8 bg-soft-gray/30 rounded-lg w-16"></div>
							</div>
							<div className="w-12 h-12 bg-soft-gray/20 rounded-xl"></div>
						</div>
					</div>
				))}
			</div>

			{/* Controls Section Skeleton */}
			<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8">
				{/* Navigation Tabs Skeleton */}
				<div className="flex flex-wrap gap-4 mb-8">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="flex items-center gap-4 px-6 py-4 bg-soft-gray/20 rounded-2xl border border-soft-gray/20"
						>
							<div className="w-10 h-10 bg-soft-gray/30 rounded-xl"></div>
							<div className="text-left space-y-1">
								<div className="flex items-center gap-3">
									<div className="h-4 bg-soft-gray/30 rounded w-16"></div>
									<div className="w-6 h-4 bg-sunset-orange/30 rounded-xl"></div>
								</div>
								<div className="h-3 bg-soft-gray/20 rounded w-20"></div>
							</div>
						</div>
					))}
				</div>

				{/* Search Bar Skeleton */}
				<div className="relative">
					<div className="w-5 h-5 bg-soft-gray/20 rounded absolute left-4 top-1/2 transform -translate-y-1/2"></div>
					<div className="w-full h-12 bg-soft-gray/20 rounded-2xl border border-soft-gray/30"></div>
				</div>
			</div>

			{/* Content Section Skeleton */}
			<div className="space-y-6">
				{/* Tickets/Products/History Cards */}
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-3xl p-8"
					>
						{/* Card Header */}
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-2xl"></div>
								<div className="space-y-2">
									<div className="h-6 bg-soft-gray/30 rounded-lg w-48"></div>
									<div className="h-4 bg-soft-gray/20 rounded-lg w-32"></div>
									<div className="h-3 bg-soft-gray/20 rounded-lg w-28"></div>
								</div>
							</div>
							<div className="text-right space-y-2">
								<div className="h-6 bg-soft-gray/30 rounded-lg w-16"></div>
								<div className="h-4 bg-soft-gray/20 rounded w-20"></div>
							</div>
						</div>
						
						{/* Card Content */}
						<div className="space-y-4">
							{/* Status or Details */}
							<div className="flex items-center gap-2">
								<div className="w-3 h-3 bg-soft-gold/30 rounded-full"></div>
								<div className="h-4 bg-soft-gray/20 rounded w-32"></div>
							</div>

							{/* Content Grid (for seats, products, etc.) */}
							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
								{Array.from({ length: 4 }).map((_, cardIndex) => (
									<div
										key={cardIndex}
										className="bg-soft-gray/10 border border-soft-gray/20 rounded-xl p-3"
									>
										<div className="h-4 bg-soft-gray/30 rounded mb-2"></div>
										<div className="h-3 bg-soft-gray/20 rounded w-16"></div>
									</div>
								))}
							</div>

							{/* Action Buttons Area */}
							<div className="flex gap-3 pt-4 border-t border-soft-gray/20">
								<div className="w-24 h-8 bg-soft-gray/20 rounded-lg"></div>
								<div className="w-32 h-8 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-lg"></div>
							</div>
						</div>
					</div>
				))}

				{/* Additional Loading Items */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{Array.from({ length: 2 }).map((_, index) => (
						<div
							key={index}
							className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-2xl p-6"
						>
							<div className="flex items-center gap-4 mb-4">
								<div className="w-12 h-12 bg-soft-gray/20 rounded-xl"></div>
								<div className="flex-1 space-y-2">
									<div className="h-5 bg-soft-gray/30 rounded w-24"></div>
									<div className="h-4 bg-soft-gray/20 rounded w-36"></div>
								</div>
							</div>
							<div className="space-y-3">
								<div className="h-3 bg-soft-gray/20 rounded w-full"></div>
								<div className="h-3 bg-soft-gray/20 rounded w-3/4"></div>
								<div className="h-3 bg-soft-gray/20 rounded w-1/2"></div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
} 
