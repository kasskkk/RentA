import { NavLink } from "react-router";

export default function NotFound() {
    return (
        <>
            <div>NotFound</div>
            <NavLink to="/apartments" className="btn btn-prmiary">
                <span>Back to the apartments</span>
            </NavLink>
        </>
    )
}
