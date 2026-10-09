import { useEffect, useState } from "react";
import {Link}from "react-router-dom";

import {
  getApplications,
  getCompanies,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../services/api";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingApplicationId, setEditingApplicationId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchApplications = async () => {
    try {
      const data = await getApplications();

      setApplications(data.applications);
    } catch (error) {
      console.error("Applications fetch error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const applicationsData = await getApplications();
        const companiesData = await getCompanies();

        setApplications(applicationsData.applications);
        setCompanies(companiesData.companies);
      } catch (error) {
        console.error("Applications page loading error:", error);

        setError(error.message);
      }
    };

    loadData();
  }, []);

  const filteredApplications = applications
    .filter((application) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        application.job_title.toLowerCase().includes(search) ||
        application.company_name.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.created_at) - new Date(a.created_at);
      }

      if (sortBy === "oldest") {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      if (sortBy === "jobTitle") {
        return a.job_title.localeCompare(b.job_title);
      }

      if (sortBy === "company") {
        return a.company_name.localeCompare(b.company_name);
      }

      return 0;
    });

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
        await updateApplication(editingApplicationId, applicationData);

        setMessage("Application updated successfully.");

        clearForm();
        fetchApplications();

        return;
      }

      await createApplication(applicationData);

      setMessage("Application created successfully.");

      clearForm();
      fetchApplications();
    } catch (error) {
      console.error("Application operation error:", error);
      setError(error.message);
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

    try {
      await deleteApplication(applicationId);

      setMessage("Application deleted successfully.");

      fetchApplications();
    } catch (error) {
      console.error("Delete application error:", error);
      setError(error.message);
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

        <button type="submit">
          {editingApplicationId ? "Update Application" : "Add Application"}
        </button>

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

      <h2>My Applications</h2>

      <div>
        <input
          type="text"
          placeholder="Search by job title or company"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Assessment">Assessment</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="jobTitle">Job Title (A–Z)</option>
          <option value="company">Company (A–Z)</option>
        </select>
      </div>

      {filteredApplications.length === 0 && <p>No applications found.</p>}

      {filteredApplications.map((application) => (
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
          <Link to={`/applications/${application.id}`}>View Details</Link>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default ApplicationsPage;
