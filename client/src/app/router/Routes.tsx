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

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <HomePage /> },
            { path: 'apartments', element: <ApartmentDashboard /> },
            { path: 'apartments/:id', element: <ApartmentDetail /> },
            { path: 'createApartment', element: <ApartmentForm /> },
            { path: 'editApartment/:id', element: <ApartmentForm /> },
            { path: 'errors', element: <TestErrors /> },
            { path: 'not-found', element: <NotFound /> },
            { path: 'server-error', element: <ServerError /> },
            { path: 'login', element: <LoginForm /> },
            { path: '*', element: <Navigate replace to='not-found' /> },
        ]
    }
])