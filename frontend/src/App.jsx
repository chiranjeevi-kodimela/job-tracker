import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "../components/protectedRoute";
import ApplicationsPage from "../pages/ApplicationsPage";
import CompaniesPage from "../pages/CompaniesPage";
import DashboardPage from "../pages/DashboardPage";
import InterviewsPage from "../pages/InterviewsPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
