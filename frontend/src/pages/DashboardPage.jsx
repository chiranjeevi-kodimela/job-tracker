import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Alert from "../components/Alert";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../context/useAuth";
import { getApplications, getCompanies, getInterviews } from "../services/api";
import {
  countByStatus,
  filterAndSortApplications,
} from "../utils/applications";
import { formatDate, formatTime } from "../utils/dates";
import { getUpcomingInterviews } from "../utils/interviews";

function StatCard({ label, value, tone }) {
  return (
    <div className={`card stat-card${tone ? ` stat-${tone}` : ""}`}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [applicationsData, interviewsData, companiesData] =
          await Promise.all([
            getApplications(),
            getInterviews(),
            getCompanies(),
          ]);

        setApplications(applicationsData.applications);
        setInterviews(interviewsData.interviews);
        setCompanies(companiesData.companies);
      } catch (loadError) {
        setError(loadError.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) return <Loading label="Loading dashboard..." />;
  if (error) return <Alert>{error}</Alert>;

  const statusCounts = countByStatus(applications);
  const upcomingInterviews = getUpcomingInterviews(interviews);
  const selectedCount =
    statusCounts.find((item) => item.status === "Selected")?.count ?? 0;
  const recentApplications = filterAndSortApplications(applications, {
    sortBy: "newest",
  }).slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name}` : ""}`}
        subtitle="Here's where your job search stands."
      >
        <Link to="/applications" className="btn btn-primary">
          View applications
        </Link>
      </PageHeader>

      <div className="stats">
        <StatCard label="Total Applications" value={applications.length} />
        <StatCard label="Total Companies" value={companies.length} />
        <StatCard label="Total Interviews" value={interviews.length} />
        <StatCard
          label="Selected Applications"
          value={selectedCount}
          tone="success"
        />
        <StatCard
          label="Upcoming Interviews"
          value={upcomingInterviews.length}
          tone="warning"
        />
      </div>

      <div className="dashboard-grid">
        <section className="card" aria-labelledby="status-heading">
          <h2 id="status-heading" className="card-title">
            Application Status
          </h2>

          <ul className="status-list">
            {statusCounts.map(({ status, count }) => (
              <li key={status}>
                <div className="status-row">
                  <StatusBadge status={status} />
                  <span>{count}</span>
                </div>
                <div className="bar" aria-hidden="true">
                  <span
                    className={`bar-fill bar-${status.toLowerCase()}`}
                    style={{
                      width: applications.length
                        ? `${(count / applications.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card" aria-labelledby="upcoming-heading">
          <div className="card-header">
            <h2 id="upcoming-heading" className="card-title">
              Upcoming Interviews
            </h2>
            <Link to="/interviews">See all</Link>
          </div>

          {upcomingInterviews.length === 0 ? (
            <p className="muted">No upcoming interviews scheduled.</p>
          ) : (
            <ul className="list">
              {upcomingInterviews.slice(0, 5).map((interview) => (
                <li key={interview.id} className="list-item">
                  <div>
                    <strong>{interview.interview_type}</strong>
                    <div className="muted">
                      {interview.job_title} · {interview.company_name}
                    </div>
                  </div>
                  <div className="list-meta">
                    <div>{formatDate(interview.interview_date)}</div>
                    <div className="muted">
                      {formatTime(interview.interview_time)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section
          className="card dashboard-wide"
          aria-labelledby="recent-heading"
        >
          <div className="card-header">
            <h2 id="recent-heading" className="card-title">
              Recent Applications
            </h2>
            <Link to="/applications">See all</Link>
          </div>

          {recentApplications.length === 0 ? (
            <p className="muted">
              You haven't added any applications yet.{" "}
              <Link to="/applications">Add your first one</Link>.
            </p>
          ) : (
            <ul className="list">
              {recentApplications.map((application) => (
                <li key={application.id} className="list-item">
                  <div>
                    <Link to={`/applications/${application.id}`}>
                      <strong>{application.job_title}</strong>
                    </Link>
                    <div className="muted">{application.company_name}</div>
                  </div>
                  <StatusBadge status={application.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

export default DashboardPage;
