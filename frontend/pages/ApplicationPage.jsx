import { useEffect, useState } from "react";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);

  const [companyId, setCompanyId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [status, setStatus] = useState("Applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [editingApplicationId, setEditingApplicationId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch companies.");
        return;
      }

      setCompanies(Array.isArray(data.companies) ? data.companies : []);
    } catch (error) {
      console.error("Companies fetch error:", error);
      setError("Unable to connect to the server.");
    }
  };

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

      setApplications(
        Array.isArray(data.applications) ? data.applications : [],
      );
    } catch (error) {
      console.error("Applications fetch error:", error);
      setError("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    fetchCompanies();
    fetchApplications();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!companyId) {
      setError("Please select a company.");
      return;
    }

    if (!jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }

    const token = localStorage.getItem("token");

    const applicationData = {
      company_id: Number(companyId),
      job_title: jobTitle,
      job_url: jobUrl,
      status: status,
      applied_date: appliedDate || null,
      job_description: jobDescription,
      notes: notes,
    };

    try {
      if (editingApplicationId) {
        const response = await fetch(
          `http://localhost:5000/api/applications/${editingApplicationId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(applicationData),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to update application.");
          return;
        }

        setMessage("Application updated successfully.");

        clearForm();
        fetchApplications();

        return;
      }

      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create application.");
        return;
      }

      setMessage("Application created successfully.");

      clearForm();
      fetchApplications();
    } catch (error) {
      console.error("Application operation error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const handleEdit = (application) => {
    setEditingApplicationId(application.id);

    setCompanyId(String(application.company_id));
    setJobTitle(application.job_title);
    setJobUrl(application.job_url || "");
    setStatus(application.status);
    setAppliedDate(application.applied_date || "");
    setJobDescription(application.job_description || "");
    setNotes(application.notes || "");

    setError("");
    setMessage("");
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/applications/${applicationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete application.");
        return;
      }

      setMessage("Application deleted successfully.");

      fetchApplications();
    } catch (error) {
      console.error("Delete application error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const clearForm = () => {
    setEditingApplicationId(null);

    setCompanyId("");
    setJobTitle("");
    setJobUrl("");
    setStatus("Applied");
    setAppliedDate("");
    setJobDescription("");
    setNotes("");
  };

  const handleCancelEdit = () => {
    clearForm();

    setError("");
    setMessage("");
  };

  return (
    <div>
      <h1>Applications</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <hr />

      <h2>{editingApplicationId ? "Edit Application" : "Add Application"}</h2>

      <form onSubmit={handleSubmit}>
        {}

        <div>
          <label>Company</label>
          <br />

          <select
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
          >
            <option value="">Select Company</option>

            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        {}

        <div>
          <label>Job Title</label>
          <br />

          <input
            type="text"
            placeholder="Software Engineer"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Job URL</label>
          <br />

          <input
            type="text"
            placeholder="https://example.com/job"
            value={jobUrl}
            onChange={(event) => setJobUrl(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Status</label>
          <br />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="Applied">Applied</option>
            <option value="Assessment">Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <br />

        {}

        <div>
          <label>Applied Date</label>
          <br />

          <input
            type="date"
            value={appliedDate}
            onChange={(event) => setAppliedDate(event.target.value)}
          />
        </div>

        <br />

        {}

        <div>
          <label>Job Description</label>
          <br />

          <textarea
            placeholder="Enter job description"
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            rows="5"
          />
        </div>

        <br />

        {}

        <div>
          <label>Notes</label>
          <br />

          <textarea
            placeholder="Enter notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows="4"
          />
        </div>

        <br />

        {}

        <button type="submit">
          {editingApplicationId ? "Update Application" : "Add Application"}
        </button>

        {}

        {editingApplicationId && (
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

      <h2>My Applications</h2>

      {applications.length === 0 && <p>No applications found.</p>}

      {applications.map((application) => (
        <div key={application.id}>
          <h3>{application.job_title}</h3>
          <p>
            <strong>Company:</strong> {application.company_name}
          </p>
          <p>
            <strong>Status:</strong> {application.status}
          </p>
          <p>
            <strong>Applied Date:</strong>{" "}
            {application.applied_date || "Not provided"}
          </p>
          <p>
            <strong>Job URL:</strong> {application.job_url || "Not provided"}
          </p>
          <p>
            <strong>Job Description:</strong>{" "}
            {application.job_description || "Not provided"}
          </p>
          <p>
            <strong>Notes:</strong> {application.notes || "Not provided"}
          </p>
          <button onClick={() => handleEdit(application)}>Edit</button>{" "}
          <button onClick={() => handleDelete(application.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ApplicationsPage;
