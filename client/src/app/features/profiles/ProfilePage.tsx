import { useState } from "react";
import { useParams } from "react-router";
import { useProfile } from "../../../lib/hooks/useProfiles"
import PhotoUploadWidget from "../../shared/components/PhotoUploadWidget";

export default function ProfilePage() {
    const { id } = useParams();
    const { profile, isCurrentUser, uploadPhoto } = useProfile(id);
    const [editMode, setEditMode] = useState(false);

    const handlePhotoUpload = (file: Blob) => {
        uploadPhoto.mutate(file, {
            onSuccess: () => {
                setEditMode(false);
            }
        })
    }

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
                {editMode ? (
                    <PhotoUploadWidget uploadPhoto={handlePhotoUpload} loading={uploadPhoto.isPending} />
                ) : <div></div>}
            </div>
            <div>
                <div>First name: {profile?.firstName}</div>
                <div className="divider"></div>
                <div>Last name: {profile?.lastName}</div>
                <div className="divider"></div>
                <div>Display name: {profile?.displayName}</div>
                <div className="divider"></div>
                <div>Phone number: {profile?.phoneNumber}</div>
            </div>
        </>
    )
}
