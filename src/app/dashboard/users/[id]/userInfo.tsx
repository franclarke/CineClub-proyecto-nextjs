'use client'
import { useEffect, useState } from 'react'
import { getAllMemberships, getUserById, updateUser } from '../data-access'
import { UserIcon, ArrowLeft, Pencil, Save, X } from 'lucide-react'
import Link from 'next/link'

interface UserInfoProps {
    userId: string
}

interface Membership {
    id: string
    name: string
}

export default function UserInfo({ userId }: UserInfoProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<{ name: string; email: string; membershipId: string }>({ name: '', email: '', membershipId: '' })
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [memberships, setMemberships] = useState<Membership[]>([])
    const [success, setSuccess] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Cargar usuario y membresías al montar
    useEffect(() => {
        getUserById(userId).then(u => {
            setUser(u)
            setForm({ name: u?.name || '', email: u?.email || '', membershipId: u?.membershipId || u?.membership?.id || '' })
            setLoading(false)
        })
        getAllMemberships().then(setMemberships)
    }, [userId])

    if (loading) return <div className="text-white">Cargando...</div>
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="bg-gray-800/90 text-white p-8 rounded-2xl shadow-lg border border-gray-700 max-w-md w-full relative">
                    <Link
                        href="/dashboard/users"
                        className="absolute left-4 top-4 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h2 className="text-xl font-bold mb-2 text-center">Usuario no encontrado</h2>
                    <p className="text-center text-gray-400">El usuario con el ID proporcionado no existe.</p>
                </div>
            </div>
        )
    }

    const handleEdit = () => setIsEditing(true)
    const handleCancel = () => {
        setIsEditing(false)
        setForm({
            name: user.name || '',
            email: user.email || '',
            membershipId: user.membershipId || user.membership?.id || ''
        })
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    const handleSave = async () => {
        await updateUser(userId, form)
        setUser({ ...user, ...form, membership: memberships.find(m => m.id === form.membershipId) })
        setIsEditing(false)
        setSuccess(true)
        setShowSuccess(true)
        setTimeout(() => setSuccess(false), 2000)   // inicia animación de salida
        setTimeout(() => setShowSuccess(false), 2500) // oculta el div después de la animación
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] relative">
            {/* Mensaje de éxito flotante, centrado arriba */}
            {(showSuccess || success) && (
                <div
                    className={`
                        fixed top-20 left-1/2 transform -translate-x-1/2
                        bg-green-500/90 text-white px-6 py-3 rounded-xl shadow-lg z-50
                        transition-all duration-500
                        ${success ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
                    `}
                >
                    Cambios guardados correctamente
                </div>
            )}
            <div className="bg-gray-800/90 border border-gray-700 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 relative">
                <Link
                    href="/dashboard/users"
                    className="absolute left-4 top-4 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                >
                    <ArrowLeft className="w-8 h-8" />
                </Link>
                {!isEditing ? (
                    <button
                        type="button"
                        onClick={handleEdit}
                        className="absolute right-4 top-4 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                        title="Editar usuario"
                    >
                        <Pencil className="w-6 h-6" />
                    </button>
                ) : (
                    <div className="absolute right-4 top-4 flex gap-2">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="text-green-400 hover:text-green-600"
                            title="Guardar"
                        >
                            <Save className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="text-red-400 hover:text-red-600"
                            title="Cancelar"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                )}
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500/20 rounded-full p-4 mb-2 border border-orange-400/30">
                        <UserIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    {!isEditing ? (
                        <>
                            <h2 className="text-2xl font-bold text-white">{user.name || 'Sin nombre'}</h2>
                            <span className="text-sm text-gray-400">{user.email || '-'}</span>
                        </>
                    ) : (
                        <>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="text-2xl font-bold text-white bg-gray-700 rounded p-1 mb-1 text-center"
                            />
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="text-sm text-gray-400 bg-gray-700 rounded p-1 text-center"
                            />
                        </>
                    )}
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between text-gray-300">
                        <span className="font-semibold">ID:</span>
                        <span className="text-gray-400">{user.id}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 items-center">
                        <span className="font-semibold">Membresía:</span>
                        {!isEditing ? (
                            <span className={`px-2 py-1 rounded text-xs font-semibold border
                                ${user.membership?.name === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                    user.membership?.name === 'Silver' ? 'bg-gray-400/20 text-gray-200 border-gray-400/30' :
                                        user.membership?.name === 'Bronze' ? 'bg-orange-700/20 text-orange-400 border-orange-700/30' :
                                            'bg-gray-700/40 text-gray-400 border-gray-700/30'}
                            `}>
                                {user.membership?.name || 'Sin membresía'}
                            </span>
                        ) : (
                            <select
                                name="membershipId"
                                value={form.membershipId}
                                onChange={handleChange}
                                className="px-2 py-1 rounded text-xs font-semibold border bg-gray-700 text-gray-200"
                            >
                                {memberships.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="flex justify-between text-gray-300">
                        <span className="font-semibold">Creado:</span>
                        <span className="text-gray-400">{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}