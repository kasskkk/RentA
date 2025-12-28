import { NavLink } from "react-router"
import type { Profile } from "../../../lib/types"

type Props = {
    profile: Profile
}

export default function ProfileAvatarCard({ profile }: Props) {
    return (
        <NavLink to={`/profiles/${profile.id}`}>
            <div
                className="avatar tooltip tooltip-bottom"
                data-tip={profile.displayName}
            >
                <div className="w-24 h-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center hover:shadow-lg transition">
                    <span className="text-3xl">{profile.displayName?.[0]?.toUpperCase()}</span>
                </div>
            </div>
        </NavLink>
    )
}
