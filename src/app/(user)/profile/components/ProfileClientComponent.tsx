'use client'

import { useState } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Star, User as UserIcon, CreditCard, History, Edit3Icon, CheckIcon, ArrowRightIcon, SparklesIcon, ShoppingCartIcon } from 'lucide-react'
import { useCart } from '@/lib/cart/cart-context'

type UserWithMembership = User & {
	membership: {
		id: string
		name: string
		price: number
		benefits: string | null
		priority: number
	}
	reservations: Array<{
		id: string
		createdAt: Date
		event: {
			title: string
			dateTime: Date
			location: string
		}
	}>
}

interface ProfileClientComponentProps {
	user: UserWithMembership
	membershipTiers: MembershipTier[]
}

export function ProfileClientComponent({ user, membershipTiers }: ProfileClientComponentProps) {
	const router = useRouter()
	const { addProduct, toggleCart } = useCart()
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [addingToCart, setAddingToCart] = useState<string | null>(null)
	const [formData, setFormData] = useState({
		name: user.name || '',
		email: user.email
	})

	const handleSaveProfile = async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/profile/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData)
			})

			if (response.ok) {
				setIsEditing(false)
				router.refresh()
			}
		} catch (error) {
			console.error('Error updating profile:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleMembershipChange = async (tier: MembershipTier) => {
		setAddingToCart(tier.id)
		try {
			// Crear un producto virtual para la membresía
			const membershipProduct = {
				id: `membership-${tier.id}`,
				name: `Upgrade a Membresía ${tier.name}`,
				description: tier.benefits || `Actualiza tu membresía a ${tier.name}`,
				price: tier.price,
				stock: 999, // Siempre disponible
				createdAt: new Date(),
				updatedAt: new Date()
			}
			
			// Agregar al carrito
			addProduct(membershipProduct, 1)
			
			// Mostrar el carrito
			setTimeout(() => {
				toggleCart()
			}, 500)
			
		} catch (error) {
			console.error('Error agregando membresía al carrito:', error)
		} finally {
			setTimeout(() => {
				setAddingToCart(null)
			}, 1000)
		}
	}

	return (
		<div className="space-y-6">
			{/* Profile Info Section */}
			<div className="glass-card rounded-2xl p-6 animate-fade-in">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-12 h-12 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl flex items-center justify-center">
							<UserIcon className="w-6 h-6 text-sunset-orange" />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-soft-beige">Información Personal</h2>
							<p className="text-soft-beige/60 text-sm">Gestiona tus datos de cuenta</p>
						</div>
					</div>
					<button
						onClick={() => setIsEditing(!isEditing)}
						disabled={isLoading}
						className={`
							flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
							${isEditing 
								? 'bg-soft-gray/20 text-soft-beige hover:bg-soft-gray/30 border border-soft-gray/20' 
								: 'bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night hover:shadow-lg'
							}
							hover:scale-[1.02] group
						`}
					>
						{isEditing ? (
							<span>Cancelar</span>
						) : (
							<>
								<Edit3Icon className="w-4 h-4" />
								<span>Editar</span>
							</>
						)}
					</button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="block text-soft-beige font-medium text-sm">Nombre Completo</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							disabled={!isEditing}
							className={`
								w-full px-4 py-3 rounded-xl transition-all duration-200 text-sm
								${isEditing 
									? 'bg-soft-gray/20 border border-soft-gray/30 text-soft-beige focus:border-sunset-orange focus:outline-none focus:ring-2 focus:ring-sunset-orange/20' 
									: 'bg-soft-gray/10 border border-soft-gray/10 text-soft-beige/80 cursor-not-allowed'
								}
							`}
							required
						/>
					</div>
					<div className="space-y-2">
						<label className="block text-soft-beige font-medium text-sm">Email</label>
						<input
							type="email"
							value={formData.email}
							disabled={true}
							className="w-full px-4 py-3 rounded-xl bg-soft-gray/10 border border-soft-gray/10 text-soft-beige/60 cursor-not-allowed text-sm"
						/>
						<p className="text-soft-beige/50 text-xs">El email no se puede modificar</p>
					</div>
				</div>

				{isEditing && (
					<div className="flex gap-3 mt-6">
						<button
							onClick={handleSaveProfile}
							disabled={isLoading}
							className="flex items-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] group text-sm"
						>
							{isLoading ? (
								<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
							) : (
								<>
									<CheckIcon className="w-4 h-4" />
									<span>Guardar Cambios</span>
								</>
							)}
						</button>
						<button
							onClick={() => {
								setIsEditing(false)
								setFormData({ name: user.name || '', email: user.email })
							}}
							className="flex items-center space-x-2 bg-soft-gray/20 text-soft-beige px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 text-sm"
						>
							<span>Cancelar</span>
						</button>
					</div>
				)}
			</div>

			{/* Current Membership Section */}
			<div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-xl flex items-center justify-center">
						<CreditCard className="w-6 h-6 text-soft-gold" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-soft-beige">Mi Membresía</h2>
						<p className="text-soft-beige/60 text-sm">Estado actual de tu suscripción</p>
					</div>
				</div>

				<div className="bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-xl p-6 mb-6 border border-soft-gold/20">
					<div className="flex items-center justify-between">
						<div className="space-y-3">
							<div className="flex items-center space-x-3">
								<SparklesIcon className="w-5 h-5 text-soft-gold" />
								<h3 className="text-xl font-bold text-soft-beige">
									{user.membership.name}
								</h3>
							</div>
							<p className="text-xl font-bold text-soft-beige/80">
								${user.membership.price}/mes
							</p>
							<div className="flex flex-wrap gap-2">
								{(user.membership.benefits 
									? user.membership.benefits.split(',').map(b => b.trim()).filter(Boolean)
									: []
								).map((benefit, index) => (
									<span
										key={index}
										className="bg-soft-gold/20 text-soft-gold px-3 py-1 rounded-full text-xs font-medium border border-soft-gold/30"
									>
										{benefit}
									</span>
								))}
							</div>
						</div>
						<div className="text-right space-y-3">
							<div className="flex items-center gap-1">
								{/* Show stars based on tier level - Gold (3 stars), Silver (2 stars), Bronze (1 star) */}
								{[...Array(4 - user.membership.priority)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-soft-gold fill-current" />
								))}
							</div>
							<button
								onClick={() => router.push('/memberships')}
								className="flex items-center space-x-2 bg-soft-gray/20 text-soft-beige px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group text-sm"
							>
								<span>Cambiar Plan</span>
								<ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
							</button>
						</div>
					</div>
				</div>

				{/* Available Upgrades */}
				{membershipTiers.filter(tier => tier.priority < user.membership.priority).length > 0 && (
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-soft-beige">
							Upgrades Disponibles
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{membershipTiers
								.filter(tier => tier.priority < user.membership.priority)
								.map((tier) => (
									<div
										key={tier.id}
										className="bg-soft-gray/10 border border-soft-gray/20 rounded-xl p-4 hover:border-soft-gold/50 transition-all duration-300 hover:bg-soft-gray/20 group"
									>
										<div className="flex items-center justify-between">
											<div className="space-y-1">
												<h5 className="font-bold text-soft-beige group-hover:text-sunset-orange transition-colors duration-300">{tier.name}</h5>
												<p className="text-soft-beige/80">${tier.price}/mes</p>
											</div>
											<button
												onClick={() => handleMembershipChange(tier)}
												disabled={addingToCart === tier.id}
												className="flex items-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-3 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group text-sm"
											>
												{addingToCart === tier.id ? (
													<>
														<div className="w-3 h-3 border-2 border-deep-night/30 border-t-deep-night rounded-full animate-spin" />
														<span>Agregando...</span>
													</>
												) : (
													<>
														<ShoppingCartIcon className="w-3 h-3" />
														<span>Agregar</span>
													</>
												)}
											</button>
										</div>
									</div>
								))}
						</div>
					</div>
				)}
			</div>

			{/* Recent Activity Section */}
			<div className="glass-card rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
				<div className="flex items-center gap-4 mb-6">
					<div className="w-12 h-12 bg-gradient-to-r from-soft-beige/20 to-soft-gray/20 rounded-xl flex items-center justify-center">
						<History className="w-6 h-6 text-soft-beige" />
					</div>
					<div>
						<h2 className="text-2xl font-bold text-soft-beige">Actividad Reciente</h2>
						<p className="text-soft-beige/60 text-sm">Tus últimas reservas y transacciones</p>
					</div>
				</div>

				{user.reservations.length > 0 ? (
					<div className="space-y-4">
						{user.reservations.map((reservation) => (
							<div
								key={reservation.id}
								className="flex items-center justify-between p-4 bg-soft-gray/10 border border-soft-gray/20 rounded-xl hover:bg-soft-gray/20 transition-all duration-300 group"
							>
								<div className="space-y-1">
									<h4 className="font-semibold text-soft-beige group-hover:text-sunset-orange transition-colors duration-300">
										{reservation.event.title}
									</h4>
									<p className="text-soft-beige/80 text-sm">
										{new Date(reservation.event.dateTime).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
									<p className="text-soft-beige/60 text-xs">
										{reservation.event.location}
									</p>
								</div>
								<div className="text-right">
									<span className="text-soft-gold font-medium text-sm">
										Reservado el {new Date(reservation.createdAt).toLocaleDateString('es-ES')}
									</span>
								</div>
							</div>
						))}
						<div className="text-center pt-4">
							<button
								onClick={() => router.push('/wallet')}
								className="flex items-center space-x-2 bg-soft-gray/20 text-soft-beige px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group mx-auto text-sm"
							>
								<span>Ver Todas las Reservas</span>
								<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
							</button>
						</div>
					</div>
				) : (
					<div className="text-center py-8">
						<div className="w-16 h-16 bg-soft-gray/20 rounded-xl flex items-center justify-center mx-auto mb-4">
							<History className="w-8 h-8 text-soft-gray" />
						</div>
						<h3 className="text-lg font-semibold text-soft-beige mb-3">
							No tienes reservas recientes
						</h3>
						<p className="text-soft-beige/60 mb-6 text-sm">
							Cuando hagas tu primera reserva, aparecerá aquí
						</p>
						<button
							onClick={() => router.push('/events')}
							className="flex items-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group mx-auto text-sm"
						>
							<span>Explorar Eventos</span>
							<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
						</button>
					</div>
				)}
			</div>
		</div>
	)
} 
