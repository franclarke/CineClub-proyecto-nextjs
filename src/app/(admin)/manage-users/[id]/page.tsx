import UserInfo from "./userInfo"



export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 pt-16">

            <UserInfo userId={id} ></UserInfo>

        </div>
    )
}