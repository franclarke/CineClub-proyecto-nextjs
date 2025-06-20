import { GlassCard } from '../../../components/ui/glass-card'

export function ProfileSkeletonComponent() {
	return (
		<div className="space-y-6 animate-pulse">
			{/* Profile Info Section Skeleton */}
			<div className="glass-card rounded-2xl p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-soft-gray/20 rounded-xl" />
						<div>
							<div className="w-48 h-6 bg-soft-gray/20 rounded mb-2" />
							<div className="w-32 h-4 bg-soft-gray/20 rounded" />
						</div>
					</div>
					<div className="w-20 h-10 bg-soft-gray/20 rounded-xl" />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<div className="w-32 h-4 bg-soft-gray/20 rounded" />
						<div className="w-full h-12 bg-soft-gray/10 rounded-xl" />
					</div>
					<div className="space-y-2">
						<div className="w-24 h-4 bg-soft-gray/20 rounded" />
						<div className="w-full h-12 bg-soft-gray/10 rounded-xl" />
						<div className="w-40 h-3 bg-soft-gray/20 rounded" />
					</div>
				</div>
			</div>

			{/* Current Membership Section Skeleton */}
			<div className="glass-card rounded-2xl p-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 bg-soft-gray/20 rounded-xl" />
					<div>
						<div className="w-32 h-6 bg-soft-gray/20 rounded mb-2" />
						<div className="w-48 h-4 bg-soft-gray/20 rounded" />
					</div>
				</div>

				<div className="bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl p-6 mb-6 border border-soft-gold/20">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<div className="w-5 h-5 bg-soft-gray/20 rounded" />
								<div className="w-24 h-6 bg-soft-gray/20 rounded" />
							</div>
							<div className="w-20 h-6 bg-soft-gray/20 rounded" />
							<div className="flex flex-wrap gap-2">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="w-20 h-6 bg-soft-gold/20 rounded-full" />
								))}
							</div>
						</div>
						<div className="text-right space-y-3">
							<div className="flex items-center gap-1">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="w-4 h-4 bg-soft-gold/20 rounded-full" />
								))}
							</div>
							<div className="w-32 h-10 bg-soft-gray/20 rounded-xl" />
						</div>
					</div>
				</div>

				{/* Upgrade Options Skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{[...Array(2)].map((_, i) => (
						<div key={i} className="bg-soft-gray/10 rounded-xl p-4 border border-soft-gray/20">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="w-20 h-5 bg-soft-gray/20 rounded" />
									<div className="w-16 h-4 bg-soft-gray/20 rounded" />
								</div>
								<div className="w-20 h-8 bg-soft-gray/20 rounded-lg" />
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Recent Activity Section Skeleton */}
			<div className="glass-card rounded-2xl p-6">
				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 bg-soft-gray/20 rounded-xl" />
					<div>
						<div className="w-40 h-6 bg-soft-gray/20 rounded mb-2" />
						<div className="w-56 h-4 bg-soft-gray/20 rounded" />
					</div>
				</div>

				<div className="space-y-4">
					{[...Array(3)].map((_, i) => (
						<div key={i} className="bg-soft-gray/10 rounded-xl p-4 border border-soft-gray/20">
							<div className="flex items-center justify-between">
								<div className="space-y-2">
									<div className="w-48 h-5 bg-soft-gray/20 rounded" />
									<div className="w-32 h-4 bg-soft-gray/10 rounded" />
									<div className="w-24 h-4 bg-soft-gray/10 rounded" />
								</div>
								<div className="space-y-2">
									<div className="w-20 h-4 bg-soft-gold/20 rounded" />
									<div className="w-16 h-6 bg-soft-gray/20 rounded-full" />
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
} 