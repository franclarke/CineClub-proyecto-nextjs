export function ShopSkeletonComponent() {
	return (
		<div className="space-y-8">
			{/* Filters Skeleton */}
			<div className="bg-soft-gray/5 backdrop-blur-sm border border-soft-gray/10 rounded-3xl p-6">
				<div className="space-y-6">
					{/* Search Bar Skeleton */}
					<div className="h-12 bg-soft-gray/10 rounded-2xl animate-pulse"></div>
					
					{/* Categories Skeleton */}
					<div className="flex flex-wrap gap-3">
						{[1, 2, 3, 4, 5].map((i) => (
							<div key={i} className="h-10 w-28 bg-soft-gray/10 rounded-full animate-pulse"></div>
						))}
					</div>
					
					{/* Sort Options Skeleton */}
					<div className="flex items-center justify-between">
						<div className="h-5 w-24 bg-soft-gray/10 rounded animate-pulse"></div>
						<div className="h-10 w-40 bg-soft-gray/10 rounded-xl animate-pulse"></div>
					</div>
				</div>
			</div>

			{/* Products Grid Skeleton */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
					<div key={i} className="space-y-4">
						{/* Image Skeleton */}
						<div className="aspect-square bg-soft-gray/10 rounded-2xl animate-pulse"></div>
						
						{/* Content Skeleton */}
						<div className="space-y-2">
							<div className="h-5 bg-soft-gray/10 rounded animate-pulse"></div>
							<div className="h-4 bg-soft-gray/10 rounded animate-pulse w-3/4"></div>
							<div className="flex items-center justify-between">
								<div className="h-6 w-20 bg-soft-gray/10 rounded animate-pulse"></div>
								<div className="h-9 w-24 bg-soft-gray/10 rounded-xl animate-pulse"></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
} 