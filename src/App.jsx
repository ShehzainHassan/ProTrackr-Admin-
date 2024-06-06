import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import RootLayout from "./layouts/RootLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ManageStudents from "./pages/ManageStudents";
import ManageFaculty from "./pages/ManageFaculty";
import AssignEvaluators from "./pages/AssignEvaluators";

const IsLoggedIn = !!JSON.parse(sessionStorage.getItem("LoggedEmail"));

// router and routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={IsLoggedIn ? <Dashboard /> : <Login />} />
      <Route path="adminLogin" element={<Login />} />
      <Route path="manageStudents" element={<ManageStudents />} />
      <Route path="manageFaculty" element={<ManageFaculty />} />
      <Route path="assignEvaluators" element={<AssignEvaluators />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}
export default App;
