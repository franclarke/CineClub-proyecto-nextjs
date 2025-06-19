import { GlassCard } from '../../../components/ui/glass-card'

export function MembershipsSkeletonComponent() {
	return (
		<div className="space-y-12 animate-pulse">
			{/* Current Membership Skeleton */}
			<GlassCard variant="premium" className="p-6">
				<div className="text-center">
					<div className="w-40 h-7 bg-soft-beige/20 rounded-lg mx-auto mb-4" />
					<div className="inline-flex items-center gap-3 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-lg px-6 py-4">
						<div className="w-8 h-8 bg-soft-beige/20 rounded-full" />
						<div className="text-left space-y-2">
							<div className="w-20 h-6 bg-soft-beige/20 rounded" />
							<div className="w-16 h-4 bg-soft-beige/20 rounded" />
						</div>
					</div>
				</div>
			</GlassCard>

			{/* Membership Tiers Skeleton */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{[...Array(3)].map((_, index) => (
					<div key={index} className="relative">
						{index === 1 && (
							<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
								<div className="w-24 h-8 bg-sunset-orange/50 rounded-full" />
							</div>
						)}

						<GlassCard variant="subtle" className="p-8 h-full">
							<div className="text-center mb-8">
								<div className="w-16 h-16 bg-soft-beige/20 rounded-full mx-auto mb-6" />
								<div className="w-20 h-7 bg-soft-beige/20 rounded-lg mx-auto mb-2" />
								<div className="flex items-baseline justify-center mb-6">
									<div className="w-16 h-10 bg-soft-beige/20 rounded" />
									<div className="w-8 h-4 bg-soft-beige/20 rounded ml-2" />
								</div>
							</div>

							{/* Benefits Skeleton */}
							<div className="space-y-3 mb-8">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="flex items-start gap-3">
										<div className="w-5 h-5 bg-soft-gold/20 rounded-full mt-0.5" />
										<div className="w-full h-4 bg-soft-beige/20 rounded" />
									</div>
								))}
							</div>

							{/* Button Skeleton */}
							<div className="w-full h-12 bg-soft-beige/20 rounded-lg" />
						</GlassCard>
					</div>
				))}
			</div>

			{/* Comparison Table Skeleton */}
			<GlassCard variant="subtle" className="p-8">
				<div className="w-60 h-8 bg-soft-beige/20 rounded-lg mx-auto mb-8" />
				<div className="space-y-4">
					<div className="grid grid-cols-4 gap-4 border-b border-soft-beige/20 pb-4">
						<div className="w-24 h-5 bg-soft-beige/20 rounded" />
						<div className="w-16 h-5 bg-soft-beige/20 rounded mx-auto" />
						<div className="w-16 h-5 bg-soft-beige/20 rounded mx-auto" />
						<div className="w-16 h-5 bg-soft-beige/20 rounded mx-auto" />
					</div>
					{[...Array(6)].map((_, i) => (
						<div key={i} className="grid grid-cols-4 gap-4 py-3 border-b border-soft-beige/10">
							<div className="w-32 h-4 bg-soft-beige/20 rounded" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
							<div className="w-5 h-5 bg-soft-gold/20 rounded mx-auto" />
						</div>
					))}
				</div>
			</GlassCard>
		</div>
	)
} 