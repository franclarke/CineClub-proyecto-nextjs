import { GlassCard } from '../../../components/ui/glass-card'

export function ProfileSkeletonComponent() {
	return (
		<div className="space-y-8 animate-pulse">
			{/* Profile Info Skeleton */}
			<GlassCard variant="premium" className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-soft-beige/20 rounded-full" />
						<div className="w-48 h-8 bg-soft-beige/20 rounded-lg" />
					</div>
					<div className="w-20 h-10 bg-soft-beige/20 rounded-lg" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<div className="w-32 h-4 bg-soft-beige/20 rounded" />
						<div className="w-full h-12 bg-soft-beige/10 rounded-lg" />
					</div>
					<div className="space-y-2">
						<div className="w-24 h-4 bg-soft-beige/20 rounded" />
						<div className="w-full h-12 bg-soft-beige/10 rounded-lg" />
					</div>
				</div>
			</GlassCard>

			{/* Membership Skeleton */}
			<GlassCard variant="subtle" className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-sunset-orange/20 rounded-full" />
					<div className="w-32 h-8 bg-soft-beige/20 rounded-lg" />
				</div>

				<div className="bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-lg p-6 mb-6">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<div className="w-24 h-6 bg-soft-beige/20 rounded" />
							<div className="w-16 h-5 bg-soft-beige/20 rounded" />
							<div className="flex gap-2">
								<div className="w-20 h-6 bg-soft-gold/20 rounded-full" />
								<div className="w-24 h-6 bg-soft-gold/20 rounded-full" />
								<div className="w-28 h-6 bg-soft-gold/20 rounded-full" />
							</div>
						</div>
						<div className="text-right space-y-2">
							<div className="flex gap-1">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="w-5 h-5 bg-soft-gold/20 rounded-full" />
								))}
							</div>
							<div className="w-24 h-8 bg-soft-beige/20 rounded-lg" />
						</div>
					</div>
				</div>
			</GlassCard>

			{/* Activity Skeleton */}
			<GlassCard variant="subtle" className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="w-8 h-8 bg-soft-beige/20 rounded-full" />
					<div className="w-40 h-8 bg-soft-beige/20 rounded-lg" />
				</div>

				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex items-center justify-between p-4 border border-soft-beige/20 rounded-lg"
						>
							<div className="space-y-2">
								<div className="w-48 h-5 bg-soft-beige/20 rounded" />
								<div className="w-32 h-4 bg-soft-beige/10 rounded" />
								<div className="w-24 h-4 bg-soft-beige/10 rounded" />
							</div>
							<div className="space-y-2">
								<div className="w-24 h-4 bg-soft-gold/20 rounded" />
							</div>
						</div>
					))}
				</div>
			</GlassCard>
		</div>
	)
} 