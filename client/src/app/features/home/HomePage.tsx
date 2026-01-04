import DashboardCalendar from "./DashboardCalendar";
import { useAccount } from "../../../lib/hooks/useAccounts";
import { useUserApartments } from "../../../lib/hooks/useApartments"; // Zmieniony import
import ApartmentCard from "../apartments/dashboard/ApartmentCard";

export default function HomePage() {
    const { currentUser } = useAccount();
    const { userApartments, isPendingUserApartments } = useUserApartments();

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Witaj w domu!</h1>
                <p className="text-base-content/70">Oto Twój panel zarządzania.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {currentUser?.userRole !== 'Owner' && (
                    <div className="flex justify-center md:justify-start">
                        <DashboardCalendar />
                    </div>
                )}
                
                <div>
                    <h2 className="text-xl font-bold mb-4">Twoje mieszkania</h2>
                    
                    {isPendingUserApartments ? (
                        <div className="flex justify-center p-10">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {userApartments && userApartments.length > 0 ? (
                                userApartments.map(apartment => (
                                    <ApartmentCard key={apartment.id} apartment={apartment} />
                                ))
                            ) : (
                                <div className="alert bg-base-200">
                                    Nie należysz jeszcze do żadnego mieszkania.
                                </div>
                            )}
                        </div>
                    )}
                </div>
                
                
            </div>
        </div>
    )
}