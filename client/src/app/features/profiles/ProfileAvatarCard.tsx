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
                <div className="w-9 h-9 rounded-full">
                    {profile?.imageUrl ? (
                        <img
                            src={profile.imageUrl}
                            alt={profile.displayName?.[0]}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <>
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 font-semibold">
                                {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </NavLink>
    )
}
