'use client'
import { useEffect, useState } from 'react'
import { fetchUsersByMembership } from './actions'
import Link from 'next/link'
import { Search, Edit2, Shield } from 'lucide-react'
import { BackButton } from '@/app/components/ui/back-button'
import { Button } from '@/app/components/ui/button'

type UserWithMembership = {
    id: string
    name: string | null
    email: string
    isAdmin: boolean
    membership: {
        name: string
    } | null
}

const MEMBERSHIP_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Banquito', value: 'banquito' },
    { label: 'Reposera Deluxe', value: 'reposera-deluxe' },
    { label: 'Puff XXL Estelar', value: 'puff-xxl-estelar' },
]

export default function UsersTable() {
    const [users, setUsers] = useState<UserWithMembership[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')

    useEffect(() => {
        setLoading(true)
        fetchUsersByMembership(filter).then(data => {
            setUsers(data)
            setLoading(false)
        })
    }, [filter])

    // Filtrado por nombre en el cliente
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-deep-night pt-20">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <div className="mb-6">
                    <BackButton href="/" label="Volver al inicio" />
                </div>
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-display text-3xl sm:text-4xl text-soft-beige mb-2">
                        Usuarios
                    </h1>
                    <p className="text-soft-beige/70">
                        Gestiona todos los usuarios registrados en la plataforma
                    </p>
                </div>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base placeholder:text-soft-beige/50"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-soft-beige/50" />
                    </div>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="px-4 py-3 rounded-xl bg-soft-gray/10 text-soft-beige border border-soft-gray/20 focus:outline-none focus:ring-2 focus:ring-sunset-orange focus:border-transparent transition-base"
                    >
                        {MEMBERSHIP_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value} className="bg-deep-night text-soft-beige">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="card-modern overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-soft-gray/5">
                                <tr>
                                    <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                        Nombre
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                        Email
                                    </th>
                                    <th className="py-4 px-6 text-left font-semibold text-soft-beige border-b border-soft-gray/20">
                                        Membresía
                                    </th>
                                    <th className="py-4 px-6 text-center font-semibold text-soft-beige border-b border-soft-gray/20">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8">
                                            <div className="flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-sunset-orange border-t-transparent rounded-full animate-spin mr-3" />
                                                <span className="text-soft-beige/70">Cargando usuarios...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-soft-beige/70">
                                            No se encontraron usuarios.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-soft-gray/5 transition-colors"
                                        >
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div className="text-soft-beige font-medium">
                                                    {user.name || 'Sin nombre'}
                                                </div>
                                                {user.isAdmin && (
                                                    <div className="mt-1">
                                                        <span className="px-2 py-1 bg-sunset-orange/20 text-sunset-orange border border-sunset-orange/30 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                                                            <Shield className="w-3 h-3" />
                                                            Admin
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 border-b border-soft-gray/10 text-soft-beige/90">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <span
                                                    className={`
                                                        px-3 py-1 rounded-full text-xs font-semibold border inline-block
                                                        ${user.membership?.name === 'Puff XXL Estelar' ? 'bg-soft-gold/20 text-soft-gold border-soft-gold/30' :
                                                            user.membership?.name === 'Reposera Deluxe' ? 'bg-soft-beige/20 text-soft-beige border-soft-beige/30' :
                                                                user.membership?.name === 'Banquito' ? 'bg-sunset-orange/20 text-sunset-orange border-sunset-orange/30' :
                                                                    'bg-soft-gray/20 text-soft-gray border-soft-gray/30'}
                                                    `}>
                                                    {user.membership?.name || 'Sin membresía'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 border-b border-soft-gray/10">
                                                <div className="flex items-center justify-center">
                                                    <Button
                                                        asChild
                                                        variant="secondary"
                                                        size="sm"
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Link href={`/manage-users/${user.id}`}>
                                                            <Edit2 className="w-4 h-4" />
                                                            Editar
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary */}
                {!loading && filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center text-sm text-soft-beige/70 mt-6">
                        <span>
                            Mostrando {filteredUsers.length} de {users.length} usuarios
                        </span>
                        {filter !== 'all' && (
                            <span>
                                Filtrado por: {MEMBERSHIP_OPTIONS.find(opt => opt.value === filter)?.label}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
