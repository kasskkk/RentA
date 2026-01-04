import DashboardCalendar from "./DashboardCalendar";

export default function HomePage() {
    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Witaj w domu!</h1>
                <p className="text-base-content/70">Oto Twój panel zarządzania.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex justify-center md:justify-start">
                    <DashboardCalendar />
                </div>

                {/* <div className="card bg-base-100 shadow-xl border border-base-300 h-fit">
                    <div className="card-body">
                        <h2 className="card-title">Szybkie akcje</h2>
                        <div className="flex flex-col gap-2">
                            <button className="btn btn-primary btn-outline">Zgłoś usterkę</button>
                            <button className="btn btn-ghost">Zobacz rachunki</button>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}