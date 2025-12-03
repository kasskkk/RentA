import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../features/home/HomePage";
import ApartmentDashboard from "../features/apartments/dashboard/ApartmentDashboard";
import ApartmentForm from "../features/apartments/form/ApartmentForm";
import ApartmentDetail from "../features/apartments/details/ApartmentDetails";
import TestErrors from "../features/errors/TestErrors";

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
        ]
    }
])