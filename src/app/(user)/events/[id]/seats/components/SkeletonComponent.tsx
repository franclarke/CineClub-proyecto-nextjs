export function SkeletonComponent() {
	return (
		<div className="min-h-screen bg-deep-night">
			<div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
				{/* Header */}
				<div className="mb-8">
					{/* Back Button */}
					<div className="flex items-center gap-2 mb-6">
						<div className="w-4 h-4 bg-soft-gray/20 rounded" />
						<div className="w-20 h-4 bg-soft-gray/20 rounded" />
					</div>
					
					{/* Title */}
					<div className="text-center space-y-3">
						<div className="w-80 h-8 bg-soft-gray/20 rounded mx-auto" />
						<div className="w-60 h-4 bg-soft-gray/20 rounded mx-auto" />
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Main seat map */}
					<div className="lg:col-span-3">
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/10 rounded-2xl p-8">
							{/* Screen indicator */}
							<div className="mb-12 text-center">
								<div className="w-60 h-2 bg-soft-gray/20 rounded-full mx-auto mb-4" />
								<div className="w-16 h-4 bg-soft-gray/20 rounded mx-auto" />
							</div>

							{/* Seat rows */}
							<div className="space-y-3">
								{[...Array(8)].map((_, rowIndex) => (
									<div key={rowIndex} className="relative">
										{/* Row identifier */}
										<div className="absolute -left-16 top-1/2 transform -translate-y-1/2 hidden md:block">
											<div className="w-6 h-6 bg-soft-gray/20 rounded" />
										</div>
										
										{/* Seat row */}
										<div 
											className="flex justify-center items-center gap-1.5"
											style={{
												marginLeft: `${(rowIndex / 8) * 16}px`,
												marginRight: `${(rowIndex / 8) * 16}px`
											}}
										>
											{[...Array(8 + Math.floor(rowIndex / 2))].map((_, seatIndex) => {
												const seatSize = rowIndex < 3 ? 'w-9 h-9' : rowIndex < 5 ? 'w-8 h-8' : 'w-7 h-7';
												return (
													<div
														key={seatIndex}
														className={`${seatSize} bg-soft-gray/20 rounded-lg`}
														style={{ 
															animationDelay: `${(rowIndex * 8 + seatIndex) * 0.05}s`
														}}
													/>
												);
											})}
										</div>
									</div>
								))}
							</div>

							{/* Distance indicator */}
							<div className="mt-8 text-center">
								<div className="flex justify-center space-x-8">
									<div className="w-16 h-3 bg-soft-gray/20 rounded" />
									<div className="w-16 h-3 bg-soft-gray/20 rounded" />
								</div>
							</div>
						</div>

						{/* Legend */}
						<div className="mt-6 bg-deep-night/40 backdrop-blur-sm border border-soft-gray/10 rounded-xl p-6">
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
								{[...Array(4)].map((_, i) => (
									<div key={i} className="space-y-2">
										<div className="w-6 h-6 mx-auto bg-soft-gray/20 rounded-lg" />
										<div className="w-12 h-3 bg-soft-gray/20 rounded mx-auto" />
										<div className="w-8 h-3 bg-soft-gray/20 rounded mx-auto" />
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Event info */}
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/10 rounded-xl p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-5 h-5 bg-soft-gray/20 rounded" />
								<div className="w-16 h-4 bg-soft-gray/20 rounded" />
							</div>
							<div className="space-y-3">
								<div>
									<div className="w-32 h-4 bg-soft-gray/20 rounded mb-2" />
									<div className="w-40 h-3 bg-soft-gray/20 rounded" />
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-gray/20 rounded" />
									<div className="w-24 h-3 bg-soft-gray/20 rounded" />
								</div>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-soft-gray/20 rounded" />
									<div className="w-28 h-3 bg-soft-gray/20 rounded" />
								</div>
							</div>
						</div>

						{/* Selection summary */}
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/10 rounded-xl p-6">
							<div className="w-16 h-4 bg-soft-gray/20 rounded mb-4" />
							<div className="text-center py-8">
								<div className="w-12 h-12 mx-auto mb-3 bg-soft-gray/10 rounded-full" />
								<div className="w-20 h-3 bg-soft-gray/20 rounded mx-auto mb-2" />
								<div className="w-24 h-3 bg-soft-gray/20 rounded mx-auto" />
							</div>
						</div>

						{/* Membership info */}
						<div className="bg-deep-night/60 backdrop-blur-sm border border-soft-gray/10 rounded-xl p-6">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-5 h-5 bg-soft-gray/20 rounded" />
								<div className="w-20 h-4 bg-soft-gray/20 rounded" />
							</div>
							<div>
								<div className="w-32 h-4 bg-soft-gray/20 rounded mb-2" />
								<div className="w-40 h-3 bg-soft-gray/20 rounded" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
} 