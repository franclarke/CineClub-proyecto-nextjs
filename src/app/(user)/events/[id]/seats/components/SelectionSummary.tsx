import { Button } from '@/app/components/ui/button'
import { GlassCard } from '@/app/components/ui/glass-card'

interface SelectionInfo {
	count: number
	totalPrice: number
	tierBreakdown: Record<string, number>
}

interface SelectionSummaryProps {
	selectionInfo: SelectionInfo
	onProceedToCheckout: () => void
	isProcessing: boolean
	disabled: boolean
}

export function SelectionSummary({
	selectionInfo,
	onProceedToCheckout,
	isProcessing,
	disabled
}: SelectionSummaryProps) {
	return (
		<GlassCard className="p-6">
			<h3 className="text-display text-xl text-soft-beige mb-4">
				Resumen de Selección
			</h3>
			
			{selectionInfo.count === 0 ? (
				<div className="text-center py-8">
					<div className="w-16 h-16 bg-soft-gray/20 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg className="w-8 h-8 text-soft-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
						</svg>
					</div>
					<p className="text-soft-gray text-sm">
						Selecciona tus asientos para continuar
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{/* Selection details */}
					<div className="space-y-2">
						<div className="flex justify-between items-center">
							<span className="text-soft-beige">Asientos seleccionados:</span>
							<span className="text-sunset-orange font-medium">
								{selectionInfo.count}
							</span>
						</div>
						
						{/* Tier breakdown */}
						{Object.entries(selectionInfo.tierBreakdown).map(([tier, count]) => (
							<div key={tier} className="flex justify-between items-center text-sm">
								<span className="text-soft-gray">{tier}:</span>
								<span className="text-soft-beige">{count}</span>
							</div>
						))}
					</div>

					<div className="border-t border-soft-gray/20 pt-4">
						<div className="flex justify-between items-center">
							<span className="text-soft-beige font-medium">Total:</span>
							<span className="text-sunset-orange font-bold text-lg">
								${selectionInfo.totalPrice}
							</span>
						</div>
						<p className="text-soft-gray text-xs mt-1">
							Precio por asiento: $25
						</p>
					</div>

					<Button
						onClick={onProceedToCheckout}
						disabled={disabled || isProcessing}
						loading={isProcessing}
						className="w-full btn-primary py-3 font-medium"
					>
						{isProcessing ? (
							<div className="flex items-center justify-center gap-2">
								<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
								<span>Procesando...</span>
							</div>
						) : (
							<div className="flex items-center justify-center gap-2">
								<span>Continuar al Checkout</span>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
								</svg>
							</div>
						)}
					</Button>
				</div>
			)}
			
			{/* Additional info */}
			<div className="mt-4 p-3 bg-soft-gray/10 rounded-lg">
				<p className="text-soft-gray text-xs">
					💡 Los asientos se reservarán temporalmente por 10 minutos para completar tu compra.
				</p>
			</div>
		</GlassCard>
	)
} 