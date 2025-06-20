import Navigation from '@/app/components/Navigation'
import { getUserById } from '../data-access'
import { UserIcon, ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'
import UserInfo from './userInfo'


export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const user = await getUserById(id)

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">

                <div className="bg-gray-800/90 text-white p-8 rounded-2xl shadow-lg border border-gray-700 max-w-md w-full mt-20 relative">
                    {/* Botón volver */}
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 pt-16">

            <UserInfo userId={id} ></UserInfo>

        </div>
    )
}