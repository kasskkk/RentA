import { useParams } from "react-router"
import { useProfile } from "../../../lib/hooks/useProfile";
import { useState } from "react";
import PhotoUploadWidget from "../../shared/components/PhotoUploadWidget";

export default function ProfilePage() {
    const { id } = useParams();
    const { profile, isCurrentUser } = useProfile(id);
    const [editMode, setEditMode] = useState(false);
    return (
        <>
            <div>
                {isCurrentUser && (
                    <div>
                        <button className="btn btn-primary" onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Cancel' : profile?.imageUrl ? 'Chande photo' : 'Add photo'}
                        </button>
                    </div>
                )}
            </div>
            {editMode ? (
                <PhotoUploadWidget />
            ) : <div></div>}
            <div className="card">
                <div className="w-24 h-24 rounded-full bg-neutral text-neutral-content flex items-center justify-center hover:shadow-lg transition">
                    {profile?.imageUrl ? (
                        <img
                            src={profile.imageUrl}
                            alt={profile.displayName ?? "Użytkownik"}
                        />
                    ) : (
                        <div className="text-3xl">
                            {profile?.displayName?.[0]?.toUpperCase() ?? "U"}
                        </div>
                    )}

                </div>
                <div>{profile?.firstName}das</div>
                <div className="divider"></div>
                <div>{profile?.lastName}dsds</div>
                <div className="divider"></div>
                <div>{profile?.displayName}dasads</div>
            </div>
        </>
    )
}
