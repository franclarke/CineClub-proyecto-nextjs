
export function MembershipsSkeletonComponent() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Current Membership Status Skeleton */}
			<div className="glass-card rounded-2xl p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-soft-gray/20 rounded-xl" />
						<div>
							<div className="w-40 h-5 bg-soft-gray/20 rounded mb-2" />
							<div className="w-32 h-4 bg-soft-gray/20 rounded" />
						</div>
					</div>
					<div className="w-16 h-8 bg-soft-gold/20 rounded-full" />
				</div>
			</div>

			{/* Membership Tiers Grid Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="relative">
						{/* Popular Badge Skeleton */}
						{index === 1 && (
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
								<div className="w-24 h-6 bg-sunset-orange/50 rounded-full" />
							</div>
						)}

						<div className={`glass-card rounded-2xl p-6 h-full ${index === 1 ? 'scale-[1.02]' : ''}`}>
							{/* Active Badge Skeleton */}
							{index === 0 && (
								<div className="absolute top-4 right-4">
									<div className="w-16 h-6 bg-soft-gold/20 rounded-full" />
								</div>
							)}

							<div className="space-y-6">
								{/* Header Skeleton */}
								<div className="text-center">
									<div className="w-16 h-16 bg-soft-gray/20 rounded-2xl mx-auto mb-4" />
									<div className="w-20 h-6 bg-soft-gray/20 rounded mb-2 mx-auto" />
									<div className="flex items-baseline justify-center mb-4">
										<div className="w-16 h-8 bg-soft-gray/20 rounded" />
										<div className="w-8 h-4 bg-soft-gray/20 rounded ml-1" />
									</div>
								</div>

								{/* Benefits Skeleton */}
								<ul className="space-y-3">
									{[...Array(4)].map((_, i) => (
										<li key={i} className="flex items-start gap-3">
											<div className="w-5 h-5 bg-soft-gold/20 rounded-full flex-shrink-0 mt-0.5" />
											<div className="w-full h-4 bg-soft-gray/20 rounded" />
										</li>
									))}
								</ul>

								{/* Action Button Skeleton */}
								<div className="pt-4">
									<div className="w-full h-12 bg-soft-gray/20 rounded-xl" />
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Comparison Table Skeleton */}
			<div className="glass-card rounded-2xl p-8">
				<div className="w-60 h-8 bg-soft-gray/20 rounded-lg mx-auto mb-8" />
				
				<div className="space-y-4">
					{/* Table Header Skeleton */}
					<div className="grid grid-cols-4 gap-4 border-b border-soft-gray/20 pb-4">
						<div className="w-24 h-5 bg-soft-gray/20 rounded" />
						<div className="w-16 h-5 bg-soft-gray/20 rounded mx-auto" />
						<div className="w-16 h-5 bg-soft-gray/20 rounded mx-auto" />
						<div className="w-16 h-5 bg-soft-gray/20 rounded mx-auto" />
					</div>

					{/* Table Rows Skeleton */}
					{[...Array(8)].map((_, i) => (
						<div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-soft-gray/10">
							<div className="w-32 h-4 bg-soft-gray/20 rounded" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
						</div>
					))}
				</div>
			</div>

			{/* FAQ Section Skeleton */}
			<div className="glass-card rounded-2xl p-8">
				<div className="w-48 h-8 bg-soft-gray/20 rounded-lg mx-auto mb-8" />
				
				<div className="space-y-4">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="border border-soft-gray/20 rounded-xl p-4">
							<div className="flex items-center justify-between">
								<div className="w-64 h-5 bg-soft-gray/20 rounded" />
								<div className="w-5 h-5 bg-soft-gray/20 rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
} 
