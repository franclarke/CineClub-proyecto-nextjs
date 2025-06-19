import { MembershipTier } from '@prisma/client'

interface SeatLegendProps {
	currentUserMembership: MembershipTier
}

export function SeatLegend({ currentUserMembership }: SeatLegendProps) {
	const legendItems = [
		{
			color: '#FFC857',
			label: 'Gold',
			available: currentUserMembership.priority <= 1
		},
		{
			color: '#F0E3CA',
			label: 'Silver',
			available: currentUserMembership.priority <= 2
		},
		{
			color: '#4C4A3E',
			label: 'Bronze',
			available: currentUserMembership.priority <= 3
		},
		{
			color: '#FF8C42',
			label: 'Seleccionado',
			available: true
		},
		{
			color: '#D94A29',
			label: 'Reservado',
			available: true
		}
	]

	return (
		<div className="mt-8">
			<h4 className="text-soft-beige font-medium mb-4 text-center">
				Leyenda de Asientos
			</h4>
			<div className="flex flex-wrap justify-center gap-4">
				{legendItems.map((item) => (
					<div
						key={item.label}
						className={`flex items-center gap-2 ${
							!item.available && item.label !== 'Seleccionado' && item.label !== 'Reservado'
								? 'opacity-50'
								: ''
						}`}
					>
						<div
							className="w-4 h-4 rounded-full border"
							style={{ backgroundColor: item.color }}
						/>
						<span className="text-soft-beige text-sm">
							{item.label}
							{!item.available && item.label !== 'Seleccionado' && item.label !== 'Reservado' && (
								<span className="text-warm-red ml-1">*</span>
							)}
						</span>
					</div>
				))}
			</div>
			
			{currentUserMembership.priority > 1 && (
				<p className="text-center text-soft-gray text-xs mt-4">
					* Asientos no disponibles para tu membresía {currentUserMembership.name}
				</p>
			)}
		</div>
	)
} 