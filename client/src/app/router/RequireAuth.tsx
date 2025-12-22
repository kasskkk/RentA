import { Navigate, Outlet } from "react-router";
import { useAccount } from "../../lib/hooks/useAccounts"

export default function RequireAuth() {
    const { currentUser, loadingUserIfno } = useAccount();

    if (loadingUserIfno) return <span className="loading loading-spinner loading-xl"></span>

    if (!currentUser) return <Navigate to="/login" replace />

    return (
        <Outlet />
    )
}
