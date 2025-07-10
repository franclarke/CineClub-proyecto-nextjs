import UserInfo from "./userInfo"

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div className="min-h-screen bg-deep-night pt-8">
            <UserInfo userId={id} />
        </div>
    )
}