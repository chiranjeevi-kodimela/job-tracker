import { useCallback, useEffect, useState } from "react";

import Alert from "../components/Alert";
import EmptyState from "../components/EmptyState";
import InterviewCalendar from "../components/InterviewCalendar";
import InterviewForm from "../components/InterviewForm";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import {
  createInterview,
  deleteInterview,
  getApplications,
  getInterviews,
  updateInterview,
} from "../services/api";
import { formatDate, formatTime, toISODate } from "../utils/dates";
import { getSafeUrl } from "../utils/url";

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);

  const [calendarDate, setCalendarDate] = useState(() => new Date());

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchInterviews = useCallback(async () => {
    const data = await getInterviews();
    setInterviews(data.interviews);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [applicationsData, interviewsData] = await Promise.all([
          getApplications(),
          getInterviews(),
        ]);

        setApplications(applicationsData.applications);
        setInterviews(interviewsData.interviews);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const closeForm = () => {
    setShowForm(false);
    setEditingInterview(null);
  };

  const openAddForm = () => {
    setEditingInterview(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (interview) => {
    setEditingInterview(interview);
    setShowForm(true);
    setError("");
    setMessage("");

    // Jump the calendar to the interview's month
    const [year, month] = String(interview.interview_date || "")
      .slice(0, 10)
      .split("-")
      .map(Number);

    if (year && month) setCalendarDate(new Date(year, month - 1, 1));
  };

  const handleFormSubmit = async (interviewData) => {
    setError("");
    setMessage("");

    if (editingInterview) {
      await updateInterview(editingInterview.id, interviewData);
      setMessage("Interview updated successfully.");
    } else {
      await createInterview(interviewData);
      setMessage("Interview created successfully.");
    }

    await fetchInterviews();
    closeForm();
  };

  const handleDelete = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteInterview(interviewId);
      setMessage("Interview deleted successfully.");
      await fetchInterviews();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (loading) return <Loading label="Loading interviews..." />;

  const todayISO = toISODate();

  return (
    <>
      <PageHeader
        title="Interviews"
        subtitle={`${interviews.length} scheduled`}
      >
        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          + Schedule Interview
        </button>
      </PageHeader>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {showForm && (
        <InterviewForm
          key={editingInterview?.id ?? "new"}
          applications={applications}
          interview={editingInterview}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}

      <InterviewCalendar
        interviews={interviews}
        applications={applications}
        month={calendarDate}
        onMonthChange={setCalendarDate}
        onDelete={handleDelete}
      />

      <h2 className="section-heading">My Interviews</h2>

      {interviews.length === 0 ? (
        <div className="card">
          <EmptyState title="No interviews found">
            Schedule an interview once an application moves forward.
          </EmptyState>
        </div>
      ) : (
        <div className="grid">
          {interviews.map((interview) => {
            const linkUrl = getSafeUrl(interview.meeting_link);
            const isPast =
              String(interview.interview_date).slice(0, 10) < todayISO;

            return (
              <article
                key={interview.id}
                className={`card${isPast ? " card-muted" : ""}`}
              >
                <div className="card-header">
                  <h3 className="card-title">{interview.interview_type}</h3>
                  {isPast && <span className="badge badge-past">Past</span>}
                </div>

                <dl className="details details-compact">
                  <div>
                    <dt>Company</dt>
                    <dd>{interview.company_name}</dd>
                  </div>
                  <div>
                    <dt>Job</dt>
                    <dd>{interview.job_title}</dd>
                  </div>
                  <div>
                    <dt>Date</dt>
                    <dd>{formatDate(interview.interview_date)}</dd>
                  </div>
                  <div>
                    <dt>Time</dt>
                    <dd>
                      {formatTime(interview.interview_time, "Not provided")}
                    </dd>
                  </div>
                  <div>
                    <dt>Interviewer</dt>
                    <dd>{interview.interviewer || "Not provided"}</dd>
                  </div>
                  <div>
                    <dt>Meeting Link</dt>
                    <dd>
                      {linkUrl ? (
                        <a href={linkUrl} target="_blank" rel="noreferrer">
                          Join meeting
                        </a>
                      ) : (
                        interview.meeting_link || "Not provided"
                      )}
                    </dd>
                  </div>
                </dl>

                {interview.notes && (
                  <p className="prewrap muted">{interview.notes}</p>
                )}

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(interview)}
                    aria-label={`Edit ${interview.interview_type} for ${interview.job_title}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(interview.id)}
                    aria-label={`Delete ${interview.interview_type} for ${interview.job_title}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

export default InterviewsPage;
