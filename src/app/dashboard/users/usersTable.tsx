'use client'
import { useEffect, useState } from 'react'
import { fetchUsersByMembership } from './actions'
import Link from 'next/link'
import { Search } from 'lucide-react'

const MEMBERSHIP_OPTIONS = [
    { label: 'Todos', value: 'all' },
    { label: 'Bronze', value: 'bronze' },
    { label: 'Silver', value: 'silver' },
    { label: 'Gold', value: 'gold' },
]

export default function UsersTable() {
    const [users, setUsers] = useState<any[]>([])
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
        user.name?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 pt-14">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <h2 className="text-2xl font-bold text-white">Usuarios</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                        />
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
                    >
                        {MEMBERSHIP_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="overflow-x-auto rounded shadow border border-gray-800">
                <table className="min-w-full bg-gray-900 text-white rounded">
                    <thead>
                        <tr>
                            <th className="py-3 px-4 border-b border-gray-700 text-left font-semibold">Nombre</th>
                            <th className="py-3 px-4 border-b border-gray-700 text-left font-semibold">Email</th>
                            <th className="py-3 px-4 border-b border-gray-700 text-left font-semibold">Membresía</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-400">Cargando...</td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-gray-400">No hay usuarios.</td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-800 transition-colors cursor-pointer"
                                >
                                    <td className="py-2 px-4 border-b border-gray-800">
                                        <Link
                                            href={`/dashboard/users/${user.id}`}
                                            className="hover:underline text-gray-200 font-medium"
                                        >
                                            {user.name || '-'}
                                        </Link>
                                    </td>
                                    <td className="py-2 px-4 border-b border-gray-800">{user.email}</td>
                                    <td className="py-2 px-4 border-b border-gray-800">
                                        <span
                                            className={`
                                                px-2 py-1 rounded text-xs font-semibold border text-center w-18 inline-block
                                                ${user.membership?.name === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                                    user.membership?.name === 'Silver' ? 'bg-gray-400/20 text-gray-200 border-gray-400/30' :
                                                        user.membership?.name === 'Bronze' ? 'bg-orange-700/20 text-orange-400/70 border-orange-700/30' :
                                                            'bg-gray-700/40 text-gray-400 border-gray-700/30'}
                                            `}>
                                            {user.membership?.name || 'Sin membresía'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}