import { useAccount } from "../../lib/hooks/useAccounts";
import OwnerLayout from "../layout/OwnerLayout";
import Test from "../layout/userLayouts/Test";

export default function RoleBasedLayout() {
    const { currentUser, loadingUserIfno } = useAccount();

    if (loadingUserIfno) return <div>Loading...</div>;
    if (!currentUser) return <div>Not logged in</div>;

    return currentUser.userRole === "Owner" ? <OwnerLayout /> : <Test />;
}
