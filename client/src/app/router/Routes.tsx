import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import HomePage from "../features/home/HomePage";
import ApartmentDashboard from "../features/apartments/dashboard/ApartmentDashboard";
import ApartmentForm from "../features/apartments/form/ApartmentForm";
import ApartmentDetail from "../features/apartments/details/ApartmentDetails";
import TestErrors from "../features/errors/TestErrors";
import NotFound from "../features/errors/NotFound";
import ServerError from "../features/errors/ServerError";
import LoginForm from "../features/account/LoginForm";
import RequireAuth from "./RequireAuth";
import RegisterForm from "../features/account/RegisterForm";
import RoleBasedLayout from "./RoleBasedLayout";

export const router = createBrowserRouter([
    {
        element: <RequireAuth />,
        children: [
            {
                path: "/",
                element: <RoleBasedLayout />,
                children: [
                    { path: "", element: <HomePage /> },
                    { path: "apartments", element: <ApartmentDashboard /> },
                    { path: "apartments/:id", element: <ApartmentDetail /> },
                    { path: "createApartment", element: <ApartmentForm /> },
                    { path: "editApartment/:id", element: <ApartmentForm /> },
                ],
            },
        ],
    },
    { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    { path: "*", element: <Navigate replace to="/" /> },
])