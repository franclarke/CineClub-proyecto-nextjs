import Navigation from '@/app/components/Navigation'
import UsersTable from './usersTable'

export default function UsersPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
            <Navigation />
            <UsersTable />
        </div>
    )
}