import { useEffect, useState } from "react";

function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);

  const [applicationId, setApplicationId] = useState("");
  const [interviewType, setInterviewType] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewTime, setInterviewTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [notes, setNotes] = useState("");

  const [editingInterviewId, setEditingInterviewId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch applications.");
        return;
      }

      setApplications(data.applications);
    } catch (error) {
      console.error("Applications fetch error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const fetchInterviews = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/interviews", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch interviews.");
        return;
      }

      setInterviews(data.interviews);
    } catch (error) {
      console.error("Interviews fetch error:", error);
      setError("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchInterviews();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!applicationId) {
      setError("Please select an application.");
      return;
    }

    if (!interviewType.trim()) {
      setError("Interview type is required.");
      return;
    }

    if (!interviewDate) {
      setError("Interview date is required.");
      return;
    }

    const token = localStorage.getItem("token");

    const interviewData = {
      application_id: Number(applicationId),
      interview_type: interviewType,
      interview_date: interviewDate,
      interview_time: interviewTime || null,
      meeting_link: meetingLink,
      interviewer: interviewer,
      notes: notes,
    };

    try {
      if (editingInterviewId) {
        const response = await fetch(
          `http://localhost:5000/api/interviews/${editingInterviewId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(interviewData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to update interview.");
          return;
        }

        setMessage("Interview updated successfully.");

        clearForm();
        fetchInterviews();

        return;
      }

      const response = await fetch("http://localhost:5000/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(interviewData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create interview.");
        return;
      }

      setMessage("Interview created successfully.");

      clearForm();
      fetchInterviews();
    } catch (error) {
      console.error("Interview operation error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const handleEdit = (interview) => {
    setEditingInterviewId(interview.id);

    setApplicationId(String(interview.application_id));
    setInterviewType(interview.interview_type);
    setInterviewDate(interview.interview_date || "");
    setInterviewTime(interview.interview_time || "");
    setMeetingLink(interview.meeting_link || "");
    setInterviewer(interview.interviewer || "");
    setNotes(interview.notes || "");

    setError("");
    setMessage("");
  };

  const handleDelete = async (interviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/interviews/${interviewId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete interview.");
        return;
      }

      setMessage("Interview deleted successfully.");

      fetchInterviews();
    } catch (error) {
      console.error("Delete interview error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const clearForm = () => {
    setEditingInterviewId(null);

    setApplicationId("");
    setInterviewType("");
    setInterviewDate("");
    setInterviewTime("");
    setMeetingLink("");
    setInterviewer("");
    setNotes("");
  };

  const handleCancelEdit = () => {
    clearForm();

    setError("");
    setMessage("");
  };

  return (
    <div>
      <h1>Interviews</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <hr />

      <h2>{editingInterviewId ? "Edit Interview" : "Schedule Interview"}</h2>

      <form onSubmit={handleSubmit}>
        {}

        <div>
          <label>Application</label>
          <br />

          <select
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
          >
            <option value="">Select Application</option>

            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.job_title} - {application.company_name}
              </option>
            ))}
          </select>
        </div>

        <br />

        {}

        <div>
          <label>Interview Type</label>
          <br />

          <select
            value={interviewType}
            onChange={(event) => setInterviewType(event.target.value)}
          >
            <option value="">Select Interview Type</option>

            <option value="HR Interview">HR Interview</option>

            <option value="Technical Interview">Technical Interview</option>

            <option value="Coding Round">Coding Round</option>

            <option value="Managerial Interview">Managerial Interview</option>

            <option value="System Design">System Design</option>

            <option value="Final Interview">Final Interview</option>
          </select>
        </div>

        <br />

        {}

        <div>
          <label>Interview Date</label>
          <br />

          <input
            type="date"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Interview Time</label>
          <br />

          <input
            type="time"
            value={interviewTime}
            onChange={(event) => setInterviewTime(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Meeting Link</label>
          <br />

          <input
            type="text"
            placeholder="https://meet.google.com/..."
            value={meetingLink}
            onChange={(event) => setMeetingLink(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Interviewer</label>
          <br />

          <input
            type="text"
            placeholder="Interviewer name"
            value={interviewer}
            onChange={(event) => setInterviewer(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Notes</label>
          <br />

          <textarea
            placeholder="Interview preparation notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows="4"
          />
        </div>

        <br />

        {}

        <button type="submit">
          {editingInterviewId ? "Update Interview" : "Schedule Interview"}
        </button>

        {editingInterviewId && (
          <>
            {" "}
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        )}
      </form>

      <hr />

      {}

      <h2>My Interviews</h2>

      {interviews.length === 0 && <p>No interviews found.</p>}

      {interviews.map((interview) => (
        <div key={interview.id}>
          <h3>{interview.interview_type}</h3>
          <p>
            <strong>Company:</strong> {interview.company_name}
          </p>
          <p>
            <strong>Job:</strong> {interview.job_title}
          </p>
          <p>
            <strong>Date:</strong> {interview.interview_date}
          </p>
          <p>
            <strong>Time:</strong> {interview.interview_time || "Not provided"}
          </p>
          <p>
            <strong>Interviewer:</strong>{" "}
            {interview.interviewer || "Not provided"}
          </p>
          <p>
            <strong>Meeting Link:</strong>{" "}
            {interview.meeting_link || "Not provided"}
          </p>
          <p>
            <strong>Notes:</strong> {interview.notes || "Not provided"}
          </p>
          <button onClick={() => handleEdit(interview)}>Edit</button>{" "}
          <button onClick={() => handleDelete(interview.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default InterviewsPage;
