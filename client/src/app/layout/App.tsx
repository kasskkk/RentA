import { router } from "../router/Routes";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import { Outlet, RouterProvider } from "react-router";

function App() {


  return (
    <RouterProvider router={router} />
  )
}

export default App
