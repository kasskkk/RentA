import { Navigate, Outlet } from "react-router";
import { useAccount } from "../../lib/hooks/useAccounts"

export default function RequireAuth() {
    const { currentUser, loadingUserIfno } = useAccount();

    if (loadingUserIfno) {
        return (
            <div className="flex h-screen w-screen items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (!currentUser) return <Navigate to="/login" replace />

    return (
        <Outlet />
    )
}
