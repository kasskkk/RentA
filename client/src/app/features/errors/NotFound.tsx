import { NavLink } from "react-router";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <div className="text-xl text-gray-500">NotFound</div>

            <NavLink to="/apartments" className="btn btn-primary">
                <span>Back to the apartments</span>
            </NavLink>
        </div>
    )
}
