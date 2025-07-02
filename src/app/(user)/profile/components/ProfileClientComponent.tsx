'use client'

import { useState } from 'react'
import { User, MembershipTier } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Edit3Icon, SparklesIcon, Phone, Calendar, MapPin, Save, X, CreditCard, Star, Plus, ArrowRight as ArrowRightIcon, History, Check as CheckIcon } from 'lucide-react'

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
	const [editingField, setEditingField] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [addingToCart, setAddingToCart] = useState<string | null>(null)
	const [showMembershipUpgrade, setShowMembershipUpgrade] = useState(false)
	const [formData, setFormData] = useState({
		name: user.name || '',
		email: user.email,
		phone: user.phone || '',
		birthDate: user.birthDate || '',
		location: user.location || ''
	})
	const [tempValue, setTempValue] = useState('')

	const handleFieldEdit = (field: string, currentValue: string) => {
		setEditingField(field)
		setTempValue(currentValue)
	}

	const handleFieldSave = async (field: string) => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/profile/update', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ [field]: tempValue })
			})

			if (response.ok) {
				setFormData(prev => ({ ...prev, [field]: tempValue }))
				setEditingField(null)
				router.refresh()
			}
		} catch (error) {
			console.error('Error updating profile:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleFieldCancel = () => {
		setEditingField(null)
		setTempValue('')
	}

	const handleDirectUpgrade = async (tier: MembershipTier) => {
		setAddingToCart(tier.id)
		try {
			const response = await fetch('/api/memberships/upgrade', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ tierID: tier.id })
			})

			if (response.ok) {
				const { url } = await response.json()
				window.location.href = url
			}
		} catch (error) {
			console.error('Error upgrading membership:', error)
		} finally {
			setAddingToCart(null)
		}
	}

	const ProfileField = ({ 
		label, 
		field, 
		value, 
		icon: Icon, 
		type = 'text',
		editable = true,
		placeholder = `Agregar ${label.toLowerCase()}`
	}: {
		label: string
		field: string
		value: string
		icon: React.ComponentType<{ className?: string }>
		type?: string
		editable?: boolean
		placeholder?: string
	}) => (
		<div className="group">
			<label className="block text-soft-beige font-medium text-sm mb-2 flex items-center gap-2">
				<Icon className="w-4 h-4 text-soft-beige/60" />
				{label}
			</label>
			<div className="relative">
				{editingField === field ? (
					<div className="flex items-center gap-2">
						<input
							type={type}
							value={tempValue}
							onChange={(e) => setTempValue(e.target.value)}
							className="flex-1 px-4 py-3 rounded-xl bg-soft-gray/20 border border-sunset-orange/50 text-soft-beige focus:border-sunset-orange focus:outline-none focus:ring-2 focus:ring-sunset-orange/20 text-sm"
							placeholder={placeholder}
							autoFocus
						/>
						<button
							onClick={() => handleFieldSave(field)}
							disabled={isLoading}
							className="p-2 bg-sunset-orange hover:bg-sunset-orange/80 text-deep-night rounded-lg transition-colors"
						>
							{isLoading ? (
								<div className="w-4 h-4 border-2 border-deep-night/30 border-t-deep-night rounded-full animate-spin" />
							) : (
								<Save className="w-4 h-4" />
							)}
						</button>
						<button
							onClick={handleFieldCancel}
							className="p-2 bg-soft-gray/30 hover:bg-soft-gray/50 text-soft-beige rounded-lg transition-colors"
						>
							<X className="w-4 h-4" />
						</button>
					</div>
				) : (
					<div className="flex items-center justify-between p-3 rounded-xl bg-soft-gray/10 border border-soft-gray/20 hover:border-soft-gray/40 transition-all duration-200 group">
						<span className={`text-sm ${value ? 'text-soft-beige' : 'text-soft-beige/50'}`}>
							{value || placeholder}
						</span>
						{editable && (
							<button
								onClick={() => handleFieldEdit(field, value)}
								className="opacity-0 group-hover:opacity-100 p-1 hover:bg-soft-gray/30 rounded-lg transition-all duration-200"
							>
								<Edit3Icon className="w-4 h-4 text-soft-beige/60" />
							</button>
						)}
					</div>
				)}
			</div>
		</div>
	)

	return (
		<div className="space-y-8">
			{/* Profile Info Section - Redesigned */}
			<div className="glass-card rounded-2xl p-8 animate-fade-in">
				<div className="flex items-center gap-4 mb-8">
					<div className="w-16 h-16 bg-gradient-to-r from-sunset-orange/20 to-soft-gold/20 rounded-2xl flex items-center justify-center">
						<UserIcon className="w-8 h-8 text-sunset-orange" />
					</div>
					<div>
						<h2 className="text-3xl font-bold text-soft-beige">Información Personal</h2>
						<p className="text-soft-beige/60">Mantén tu información actualizada</p>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<ProfileField
						label="Nombre Completo"
						field="name"
						value={formData.name}
						icon={UserIcon}
						placeholder="Tu nombre completo"
					/>
					
					<ProfileField
						label="Email"
						field="email"
						value={formData.email}
						icon={UserIcon}
						editable={false}
					/>
					
					<ProfileField
						label="Teléfono"
						field="phone"
						value={formData.phone}
						icon={Phone}
						type="tel"
						placeholder="Tu número de teléfono"
					/>
					
					<ProfileField
						label="Fecha de Nacimiento"
						field="birthDate"
						value={formData.birthDate}
						icon={Calendar}
						type="date"
						placeholder="dd/mm/aaaa"
					/>
					
					<div className="md:col-span-2">
						<ProfileField
							label="Ubicación"
							field="location"
							value={formData.location}
							icon={MapPin}
							placeholder="Tu ciudad o región"
						/>
					</div>
				</div>
			</div>

			{/* Current Membership Section - Redesigned with prominence */}
			<div className="relative">
				{/* Membership tier indicator */}
				<div className="absolute -top-3 left-6 z-10">
					<div className="flex items-center gap-1 bg-gradient-to-r from-soft-gold to-sunset-orange px-4 py-2 rounded-full">
						{[...Array(4 - user.membership.priority)].map((_, i) => (
							<Star key={i} className="w-4 h-4 text-deep-night fill-current" />
						))}
						<span className="text-deep-night font-bold text-sm ml-2">
							{user.membership.name}
						</span>
					</div>
				</div>

				<div className="glass-card rounded-2xl p-8 pt-12 animate-fade-in border-2 border-soft-gold/30" style={{ animationDelay: '0.1s' }}>
					<div className="flex items-center gap-4 mb-6">
						<div className="w-16 h-16 bg-gradient-to-r from-soft-gold/20 to-sunset-orange/20 rounded-2xl flex items-center justify-center">
							<CreditCard className="w-8 h-8 text-soft-gold" />
						</div>
						<div>
							<h2 className="text-3xl font-bold text-soft-beige">Mi Membresía</h2>
							<p className="text-soft-beige/60">Plan actual y beneficios</p>
						</div>
					</div>

					<div className="bg-gradient-to-r from-sunset-orange/10 to-soft-gold/10 rounded-2xl p-6 mb-8 border border-soft-gold/20">
						<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
							<div className="space-y-4">
								<div className="flex items-center space-x-3">
									<SparklesIcon className="w-6 h-6 text-soft-gold" />
									<h3 className="text-2xl font-bold text-soft-beige">
										{user.membership.name}
									</h3>
								</div>
								<p className="text-3xl font-bold text-soft-beige">
									${user.membership.price}<span className="text-lg text-soft-beige/60">/mes</span>
								</p>
								<div className="flex flex-wrap gap-2">
									{(user.membership.benefits 
										? user.membership.benefits.split(',').map(b => b.trim()).filter(Boolean)
										: []
									).map((benefit, index) => (
										<span
											key={index}
											className="bg-soft-gold/20 text-soft-gold px-4 py-2 rounded-full text-sm font-medium border border-soft-gold/30"
										>
											{benefit}
										</span>
									))}
								</div>
							</div>
							
							{/* Upgrade Section */}
							<div className="flex flex-col gap-3">
								{membershipTiers.filter(tier => tier.priority < user.membership.priority).length > 0 && (
									<>
										<button
											onClick={() => setShowMembershipUpgrade(!showMembershipUpgrade)}
											className="flex items-center justify-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
										>
											<Plus className="w-5 h-5" />
											<span>Hacer Upgrade</span>
										</button>
									</>
								)}
								
								<button
									onClick={() => router.push('/memberships')}
									className="flex items-center justify-center space-x-2 bg-soft-gray/20 text-soft-beige px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group"
								>
									<span>Ver Todos los Planes</span>
									<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
								</button>
							</div>
						</div>
					</div>

					{/* Quick Upgrade Options */}
					{showMembershipUpgrade && membershipTiers.filter(tier => tier.priority < user.membership.priority).length > 0 && (
						<div className="space-y-4 animate-fade-in">
							<h4 className="text-xl font-semibold text-soft-beige mb-4">
								🚀 Upgrades Disponibles
							</h4>
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
								{membershipTiers
									.filter(tier => tier.priority < user.membership.priority)
									.map((tier) => (
										<div
											key={tier.id}
											className="bg-gradient-to-r from-soft-gray/10 to-soft-gray/5 border border-soft-gray/30 rounded-xl p-6 hover:border-sunset-orange/50 transition-all duration-300 hover:bg-soft-gray/20 group"
										>
											<div className="flex items-center justify-between mb-4">
												<div>
													<h5 className="font-bold text-lg text-soft-beige group-hover:text-sunset-orange transition-colors duration-300">
														{tier.name}
													</h5>
													<p className="text-2xl font-bold text-soft-beige/80">
														${tier.price}<span className="text-sm">/mes</span>
													</p>
												</div>
												<div className="flex items-center gap-1">
													{[...Array(4 - tier.priority)].map((_, i) => (
														<Star key={i} className="w-4 h-4 text-soft-gold fill-current" />
													))}
												</div>
											</div>
											
											<div className="flex flex-wrap gap-2 mb-4">
												{(tier.benefits ? tier.benefits.split(',').map(b => b.trim()).filter(Boolean) : []).slice(0, 3).map((benefit, index) => (
													<span
														key={index}
														className="bg-sunset-orange/20 text-sunset-orange px-3 py-1 rounded-full text-xs border border-sunset-orange/30"
													>
														{benefit}
													</span>
												))}
											</div>

											<button
												onClick={() => handleDirectUpgrade(tier)}
												disabled={addingToCart === tier.id}
												className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-4 py-3 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
											>
												{addingToCart === tier.id ? (
													<>
														<div className="w-4 h-4 border-2 border-deep-night/30 border-t-deep-night rounded-full animate-spin" />
														<span>Procesando...</span>
													</>
												) : (
													<>
														<SparklesIcon className="w-4 h-4" />
														<span>Upgrade Ahora - ${tier.price}/mes</span>
													</>
												)}
											</button>
										</div>
									))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Recent Activity Section - Improved */}
			<div className="glass-card rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-4">
						<div className="w-16 h-16 bg-gradient-to-r from-soft-beige/20 to-soft-gray/20 rounded-2xl flex items-center justify-center">
							<History className="w-8 h-8 text-soft-beige" />
						</div>
						<div>
							<h2 className="text-3xl font-bold text-soft-beige">Actividad Reciente</h2>
							<p className="text-soft-beige/60">Tus últimas reservas y transacciones</p>
						</div>
					</div>
					<button
						onClick={() => router.push('/wallet')}
						className="flex items-center space-x-2 bg-soft-gray/20 text-soft-beige px-4 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-soft-gray/30 border border-soft-gray/20 group"
					>
						<span>Ver Todo</span>
						<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
					</button>
				</div>

				{user.reservations.length > 0 ? (
					<div className="space-y-3">
						{user.reservations.map((reservation) => (
							<div
								key={reservation.id}
								className="flex items-center justify-between p-6 bg-soft-gray/10 border border-soft-gray/20 rounded-xl hover:bg-soft-gray/20 transition-all duration-300 group hover:border-sunset-orange/30"
							>
								<div className="space-y-2">
									<h4 className="font-bold text-lg text-soft-beige group-hover:text-sunset-orange transition-colors duration-300">
										{reservation.event.title}
									</h4>
									<p className="text-soft-beige/80">
										{new Date(reservation.event.dateTime).toLocaleDateString('es-ES', {
											year: 'numeric',
											month: 'long',
											day: 'numeric',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</p>
									<p className="text-soft-beige/60 text-sm flex items-center gap-2">
										<MapPin className="w-4 h-4" />
										{reservation.event.location}
									</p>
								</div>
								<div className="text-right">
									<span className="inline-flex items-center gap-2 bg-soft-gold/20 text-soft-gold px-3 py-2 rounded-full text-sm font-medium border border-soft-gold/30">
										<CheckIcon className="w-4 h-4" />
										Confirmado
									</span>
									<p className="text-soft-beige/50 text-xs mt-2">
										{new Date(reservation.createdAt).toLocaleDateString('es-ES')}
									</p>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-12">
						<div className="w-20 h-20 bg-soft-gray/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
							<History className="w-10 h-10 text-soft-gray" />
						</div>
						<h3 className="text-xl font-bold text-soft-beige mb-3">
							No tienes reservas recientes
						</h3>
						<p className="text-soft-beige/60 mb-8">
							Cuando hagas tu primera reserva, aparecerá aquí
						</p>
						<button
							onClick={() => router.push('/events')}
							className="flex items-center space-x-2 bg-gradient-to-r from-sunset-orange to-soft-gold text-deep-night px-6 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group mx-auto"
						>
							<SparklesIcon className="w-5 h-5" />
							<span>Explorar Eventos</span>
							<ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
						</button>
					</div>
				)}
			</div>
		</div>
	)
} 
