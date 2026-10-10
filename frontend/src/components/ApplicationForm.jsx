import { useState } from "react";

import { APPLICATION_STATUSES } from "../constants";
import { toDateInputValue } from "../utils/dates";
import Field from "./Field";

const emptyValues = {
  companyId: "",
  jobTitle: "",
  jobUrl: "",
  status: "Applied",
  appliedDate: "",
  jobDescription: "",
  notes: "",
};

const toFormValues = (application) =>
  application
    ? {
        companyId: String(application.company_id),
        jobTitle: application.job_title,
        jobUrl: application.job_url || "",
        status: application.status,
        appliedDate: toDateInputValue(application.applied_date),
        jobDescription: application.job_description || "",
        notes: application.notes || "",
      }
    : emptyValues;

function ApplicationForm({ companies, application, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(application));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(application);

  const set = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!values.companyId) {
      setError("Please select a company.");
      return;
    }

    if (!values.jobTitle.trim()) {
      setError("Job title is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        company_id: Number(values.companyId),
        job_title: values.jobTitle,
        job_url: values.jobUrl,
        status: values.status,
        applied_date: values.appliedDate || null,
        job_description: values.jobDescription,
        notes: values.notes,
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">
        {isEditing ? "Edit Application" : "Add Application"}
      </h2>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {companies.length === 0 && (
        <p className="field-hint">
          You don't have any companies yet — add one on the Companies page
          first.
        </p>
      )}

      <div className="form-grid">
        <Field
          as="select"
          label="Company"
          value={values.companyId}
          onChange={set("companyId")}
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </Field>

        <Field
          label="Job Title"
          type="text"
          placeholder="Software Engineer"
          value={values.jobTitle}
          onChange={set("jobTitle")}
        />

        <Field
          label="Job URL"
          type="url"
          placeholder="https://example.com/job"
          value={values.jobUrl}
          onChange={set("jobUrl")}
        />

        <Field
          as="select"
          label="Status"
          value={values.status}
          onChange={set("status")}
        >
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Field>

        <Field
          label="Applied Date"
          type="date"
          value={values.appliedDate}
          onChange={set("appliedDate")}
        />
      </div>

      <Field
        as="textarea"
        label="Job Description"
        rows="4"
        placeholder="Paste the job description"
        value={values.jobDescription}
        onChange={set("jobDescription")}
      />

      <Field
        as="textarea"
        label="Notes"
        rows="3"
        placeholder="Anything worth remembering"
        value={values.notes}
        onChange={set("notes")}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {isEditing ? "Update Application" : "Add Application"}
        </button>

        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ApplicationForm;
