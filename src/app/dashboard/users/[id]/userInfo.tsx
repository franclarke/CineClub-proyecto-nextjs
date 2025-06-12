import { getUserById } from '../data-access'
import { UserIcon, ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'

interface UserInfoProps {
    userId: string
}

export default async function UserInfo({ userId }: UserInfoProps) {
    const user = await getUserById(userId)

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

    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <div className="bg-gray-800/90 border border-gray-700 rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col items-center gap-6 relative">
                <Link
                    href="/dashboard/users"
                    className="absolute left-4 top-4 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                >
                    <ArrowLeft className="w-8 h-8" />
                </Link>
                <Link
                    href={`/dashboard/users/${user.id}/edit`}
                    className="absolute right-4 top-4 flex items-center gap-1 text-gray-400 hover:text-orange-400 transition-colors"
                    title="Editar usuario"
                >
                    <Pencil className="w-6 h-6" />
                </Link>
                <div className="flex flex-col items-center gap-2">
                    <div className="bg-orange-500/20 rounded-full p-4 mb-2 border border-orange-400/30">
                        <UserIcon className="w-12 h-12 text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">{user.name || 'Sin nombre'}</h2>
                    <span className="text-sm text-gray-400">{user.email || '-'}</span>
                </div>
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex justify-between text-gray-300">
                        <span className="font-semibold">ID:</span>
                        <span className="text-gray-400">{user.id}</span>
                    </div>
                    <div className="flex justify-between text-gray-300 items-center">
                        <span className="font-semibold">Membresía:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border
                            ${user.membership?.name === 'Gold' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                user.membership?.name === 'Silver' ? 'bg-gray-400/20 text-gray-200 border-gray-400/30' :
                                    user.membership?.name === 'Bronze' ? 'bg-orange-700/20 text-orange-400 border-orange-700/30' :
                                        'bg-gray-700/40 text-gray-400 border-gray-700/30'}
                        `}>
                            {user.membership?.name || 'Sin membresía'}
                        </span>
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