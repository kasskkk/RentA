import { useApartments } from "../../../lib/hooks/useApartments"
import type { Apartment } from "../../../lib/types"
import ProfileAvatarCard from "../../features/profiles/ProfileAvatarCard"

type Props = {
    apartment: Apartment
}

export default function ApartmentMembersTable({ apartment }: Props) {

    const { updateMemberStatus } = useApartments();
    const membersOnly = apartment.apartmentMembers.filter(
        memb => !memb.isOwner
    );

    return (
        <div className="overflow-x-auto">
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Decision</th>
                    </tr>
                </thead>
                <tbody>
                    {membersOnly.map(memb => (
                        <tr key={memb.user.id}>
                            <td>
                                <div className="flex items-center gap-2">
                                    <ProfileAvatarCard profile={memb.user} />
                                    <div className="font-bold">{memb.user.firstName} {memb.user.lastName}</div>
                                </div>
                            </td>
                            <td>
                                <span className="badge badge-ghost badge-sm">📞: {memb.user.phoneNumber}</span>
                                <span className="badge badge-ghost badge-sm">✉️: {memb.user.email}</span>
                            </td>
                            <td>
                                {/* <span className={`badge badge-outline font-semibold ${memb.memberStatus === 'Accepted' ? 'badge-success' :
                                    memb.memberStatus === 'Rejected' ? 'badge-error' :
                                        'badge-warning'
                                    }`}>
                                    {memb.memberStatus}
                                </span> */}

                                <div className="relative w-full max-w-xs">
                                    <select
                                        className={`select select-sm focus:outline-none w-full pr-8 font-semibold ${memb.memberStatus === 'Accepted' ? 'text-success' :
                                            memb.memberStatus === 'Rejected' ? 'text-error' :
                                                'text-warning'
                                            }`}
                                        value={memb.memberStatus}
                                        onChange={(e) => {
                                            updateMemberStatus.mutate({
                                                id: apartment.id,
                                                userId: memb.user.id,
                                                newStatus: e.target.value
                                            });
                                        }}
                                    >
                                        <option value="Pending">Pending ⏳</option>
                                        <option value="Accepted">Accepted ✅</option>
                                        <option value="Rejected">Rejected ❌</option>
                                    </select>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    )
}
