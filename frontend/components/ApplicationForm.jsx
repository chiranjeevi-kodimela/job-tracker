import { useState } from "react";

function ApplicationForm() {
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [status, setStatus] = useState("Applied");

  const handleSubmit = (event) => {
    event.preventDefault();

    const applicationData = {
      company,
      jobTitle,
      status,
    };

    console.log("Application submitted:", applicationData);
  };

  return (
    <div>
      <h2>Add Job Application</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Job title"
          value={jobTitle}
          onChange={(event) => setJobTitle(event.target.value)}
        />

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

        <br />

        <button type="submit">Add Application</button>
      </form>

      <h3>Preview</h3>

      <p>Company: {company}</p>
      <p>Job Title: {jobTitle}</p>
      <p>Status: {status}</p>
    </div>
  );
}

export default ApplicationForm;
