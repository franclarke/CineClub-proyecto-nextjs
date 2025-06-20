export function WalletSkeletonComponent() {
	return (
		<div className="space-y-8">
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

			{/* Navigation Tabs Skeleton */}
			<div className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-2xl p-6">
				<div className="flex flex-wrap gap-3">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							className="flex items-center gap-3 px-6 py-3 bg-soft-gray/20 rounded-xl"
						>
							<div className="w-8 h-8 bg-soft-gray/30 rounded-lg"></div>
							<div className="h-4 bg-soft-gray/30 rounded-lg w-20"></div>
						</div>
					))}
				</div>
			</div>

			{/* Content Cards Skeleton */}
			<div className="space-y-6">
				{Array.from({ length: 3 }).map((_, index) => (
					<div
						key={index}
						className="bg-soft-beige/5 backdrop-blur-xl border border-soft-beige/10 rounded-2xl p-6"
					>
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-soft-gray/20 rounded-xl"></div>
								<div>
									<div className="h-6 bg-soft-gray/30 rounded-lg mb-2 w-48"></div>
									<div className="h-4 bg-soft-gray/20 rounded-lg w-32"></div>
								</div>
							</div>
							<div className="text-right">
								<div className="h-6 bg-soft-gray/30 rounded-lg mb-2 w-16"></div>
								<div className="h-6 bg-soft-gray/20 rounded-xl w-20"></div>
							</div>
						</div>
						
						<div className="space-y-4">
							<div className="h-4 bg-soft-gray/20 rounded-lg w-24"></div>
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
						</div>
					</div>
				))}
			</div>
		</div>
	)
} 