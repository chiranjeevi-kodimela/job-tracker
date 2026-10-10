import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import {
  deleteApplication,
  getApplicationById,
  getInterviews,
} from "../services/api";
import { formatDate, formatTime } from "../utils/dates";
import { getSafeUrl } from "../utils/url";

function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const data = await getApplicationById(id);
        setApplication(data.application);

        // Related interviews are a nice-to-have; don't fail the page without them
        try {
          const interviewData = await getInterviews();
          setInterviews(
            interviewData.interviews.filter(
              (interview) => String(interview.application_id) === String(id),
            ),
          );
        } catch {
          setInterviews([]);
        }
      } catch (loadError) {
        setError(loadError.message || "Failed to load application.");
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    try {
      await deleteApplication(application.id);
      navigate("/applications");
    } catch (deleteError) {
      setError(deleteError.message || "Failed to delete application.");
    }
  };

  if (loading) return <Loading label="Loading application details..." />;

  if (error || !application) {
    return (
      <>
        <Alert>{error || "Application not found."}</Alert>
        <Link to="/applications">← Back to Applications</Link>
      </>
    );
  }

  const jobUrl = getSafeUrl(application.job_url);

  return (
    <>
      <Link to="/applications" className="back-link">
        ← Back to Applications
      </Link>

      <PageHeader
        title={application.job_title}
        subtitle={application.company_name}
      >
        <Link
          to={`/applications?edit=${application.id}`}
          className="btn btn-outline"
        >
          Edit Application
        </Link>
        <button type="button" className="btn btn-danger" onClick={handleDelete}>
          Delete Application
        </button>
      </PageHeader>

      <div className="detail-grid">
        <section className="card">
          <h2 className="card-title">Overview</h2>

          <dl className="details">
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={application.status} />
              </dd>
            </div>
            <div>
              <dt>Application Date</dt>
              <dd>{formatDate(application.applied_date)}</dd>
            </div>
            <div>
              <dt>Job URL</dt>
              <dd>
                {jobUrl ? (
                  <a href={jobUrl} target="_blank" rel="noreferrer">
                    {application.job_url}
                  </a>
                ) : (
                  application.job_url || "Not provided"
                )}
              </dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDate(application.created_at, "Not available")}</dd>
            </div>
          </dl>

          <h3 className="section-label">Description</h3>
          <p className="prewrap">
            {application.job_description || "Not provided"}
          </p>

          <h3 className="section-label">Notes</h3>
          <p className="prewrap">{application.notes || "No notes added"}</p>
        </section>

        <section className="card">
          <h2 className="card-title">Interviews</h2>

          {interviews.length === 0 ? (
            <EmptyState title="No interviews yet">
              <Link to="/interviews">Schedule one</Link>
            </EmptyState>
          ) : (
            <ul className="list">
              {interviews.map((interview) => (
                <li key={interview.id} className="list-item">
                  <div>
                    <strong>{interview.interview_type}</strong>
                    <div className="muted">
                      {interview.interviewer || "Interviewer not set"}
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
      </div>
    </>
  );
}

export default ApplicationDetailsPage;
