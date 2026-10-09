import { useEffect, useState } from "react";

import {
  getCurrentUser,
  getApplications,
  getInterviews,
  getCompanies,
} from "../src/services/api";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userData, applicationsData, interviewsData, companiesData] =
          await Promise.all([
            getCurrentUser(),
            getApplications(),
            getInterviews(),
            getCompanies(),
          ]);

        setUser(userData.user);
        setApplications(applicationsData.applications);
        setInterviews(interviewsData.interviews);
        setCompanies(companiesData.companies);
      } catch (error) {
        console.error("Dashboard loading error:", error);
        setError(error.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const selectedApplications = applications.filter(
    (application) => application.status === "Selected",
  );

  const upcomingInterviews = interviews.filter((interview) => {
    const interviewDate = interview.interview_date.slice(0, 10);

    return interviewDate >= new Date().toISOString().slice(0, 10);
  });

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {user.name}</h2>

      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>

      <hr />

      <h2>Application Overview</h2>

      <div>
        <h3>Total Applications</h3>
        <p>{applications.length}</p>
      </div>

      <div>
        <h3>Total Companies</h3>
        <p>{companies.length}</p>
      </div>

      <div>
        <h3>Total Interviews</h3>
        <p>{interviews.length}</p>
      </div>

      <div>
        <h3>Selected Applications</h3>
        <p>{selectedApplications.length}</p>
      </div>

      <div>
        <h3>Upcoming Interviews</h3>
        <p>{upcomingInterviews.length}</p>
      </div>

      <hr />

      <h2>Application Status</h2>

      {["Applied", "Assessment", "Interview", "Selected", "Rejected"].map(
        (status) => {
          const count = applications.filter(
            (application) => application.status === status,
          ).length;

          return (
            <p key={status}>
              {status}: {count}
            </p>
          );
        },
      )}
    </div>
  );
}

export default DashboardPage;
