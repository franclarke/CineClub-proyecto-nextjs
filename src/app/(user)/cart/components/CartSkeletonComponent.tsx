export function CartSkeletonComponent() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Cart Items Section Skeleton */}
			<div className="space-y-6">
				{/* Section Header Skeleton */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-1 h-6 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full" />
						<div className="w-48 h-6 bg-soft-gray/20 rounded" />
					</div>
					<div className="w-24 h-7 bg-sunset-orange/20 rounded-full" />
				</div>

				{/* Cart Items Grid Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6"
						>
							{/* Product Header Skeleton */}
							<div className="flex items-start justify-between mb-4">
								<div className="flex-1 space-y-2">
									<div className="w-32 h-5 bg-soft-gray/20 rounded" />
									<div className="w-20 h-4 bg-soft-gray/20 rounded" />
								</div>
								<div className="w-10 h-10 bg-soft-gray/20 rounded-lg" />
							</div>

							{/* Quantity Controls Skeleton */}
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center gap-2">
									<div className="w-8 h-8 bg-soft-gray/20 rounded-lg" />
									<div className="w-12 h-6 bg-soft-gray/20 rounded" />
									<div className="w-8 h-8 bg-soft-gray/20 rounded-lg" />
								</div>
								<div className="w-8 h-8 bg-soft-gray/20 rounded-lg" />
							</div>

							{/* Price Skeleton */}
							<div className="pt-4 border-t border-soft-gray/20">
								<div className="flex justify-between items-center">
									<div className="w-16 h-4 bg-soft-gray/20 rounded" />
									<div className="w-20 h-6 bg-soft-gray/20 rounded" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Available Products Section Skeleton */}
			<div className="space-y-6">
				{/* Section Header with Search Skeleton */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
					<div className="flex items-center space-x-3">
						<div className="w-1 h-6 bg-gradient-to-b from-sunset-orange to-soft-gold rounded-full" />
						<div className="w-40 h-6 bg-soft-gray/20 rounded" />
					</div>
					<div className="w-full sm:w-80 h-10 bg-soft-gray/20 rounded-xl" />
				</div>

				{/* Categories Skeleton */}
				<div className="space-y-8">
					{[...Array(3)].map((_, categoryIndex) => (
						<div key={categoryIndex}>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-6 h-6 bg-soft-gray/20 rounded" />
								<div className="w-20 h-6 bg-soft-gray/20 rounded" />
							</div>
							
							{/* Products Grid Skeleton */}
							<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
								{[...Array(3)].map((_, productIndex) => (
									<div
										key={productIndex}
										className="bg-deep-night/40 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6"
									>
										{/* Product Header Skeleton */}
										<div className="flex items-start justify-between mb-4">
											<div className="flex-1 space-y-2">
												<div className="w-28 h-5 bg-soft-gray/20 rounded" />
												<div className="w-36 h-4 bg-soft-gray/20 rounded" />
												<div className="flex items-center gap-2">
													<div className="w-12 h-4 bg-soft-gray/20 rounded" />
													<div className="w-16 h-3 bg-soft-gray/20 rounded" />
												</div>
											</div>
											<div className="w-10 h-10 bg-soft-gray/20 rounded-lg" />
										</div>

										{/* Actions Skeleton */}
										<div className="pt-4 border-t border-soft-gray/20">
											<div className="w-full h-10 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-lg" />
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Empty State Alternative Skeleton */}
			<div className="text-center py-20 hidden">
				<div className="max-w-md mx-auto">
					<div className="w-20 h-20 bg-soft-gray/20 rounded-2xl mx-auto mb-6" />
					<div className="w-48 h-6 bg-soft-gray/20 rounded mx-auto mb-3" />
					<div className="w-64 h-4 bg-soft-gray/20 rounded mx-auto mb-8" />
					<div className="w-40 h-12 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-xl mx-auto" />
				</div>
			</div>

			{/* Sticky Checkout Section Skeleton */}
			<div className="sticky bottom-0 bg-deep-night/95 backdrop-blur-xl border-t border-soft-gray/20 p-6 -mx-4 sm:-mx-6 lg:-mx-8">
				<div className="max-w-7xl mx-auto">
					<div className="bg-deep-night/60 backdrop-blur-xl border border-soft-gray/20 rounded-2xl p-6">
						<div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
							{/* Order Summary Skeleton */}
							<div className="flex-1 space-y-3">
								<div className="w-32 h-6 bg-soft-gray/20 rounded" />
								
								<div className="space-y-2">
									<div className="flex justify-between">
										<div className="w-16 h-4 bg-soft-gray/20 rounded" />
										<div className="w-16 h-4 bg-soft-gray/20 rounded" />
									</div>
									<div className="flex justify-between">
										<div className="w-20 h-4 bg-soft-gray/20 rounded" />
										<div className="w-20 h-4 bg-soft-gray/20 rounded" />
									</div>
									<div className="flex justify-between pt-2 border-t border-soft-gray/20">
										<div className="w-12 h-6 bg-soft-gray/20 rounded" />
										<div className="w-20 h-6 bg-soft-gray/20 rounded" />
									</div>
								</div>

								{/* Membership Discount Skeleton */}
								<div className="bg-soft-gold/10 rounded-lg p-3 border border-soft-gold/20">
									<div className="flex items-center gap-2">
										<div className="w-4 h-4 bg-soft-gold/20 rounded" />
										<div className="w-32 h-4 bg-soft-gray/20 rounded" />
									</div>
								</div>
							</div>

							{/* Actions Skeleton */}
							<div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
								<div className="w-40 h-12 bg-soft-gray/20 rounded-xl" />
								<div className="w-48 h-12 bg-gradient-to-r from-sunset-orange/30 to-soft-gold/30 rounded-xl" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 