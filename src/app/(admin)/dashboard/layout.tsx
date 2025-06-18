import AdminNavigation from '@/app/components/AdminNavigation'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <AdminNavigation />
            <main>
                {children}
            </main>
        </div>
    )
}