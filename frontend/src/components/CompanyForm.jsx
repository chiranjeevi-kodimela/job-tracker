import { useState } from "react";

import Field from "./Field";

const toFormValues = (company) => ({
  name: company?.name || "",
  website: company?.website || "",
  location: company?.location || "",
});

function CompanyForm({ company, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(company));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(company);

  const set = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!values.name.trim()) {
      setError("Company name is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">
        {isEditing ? "Edit Company" : "Add Company"}
      </h2>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-grid">
        <Field
          label="Company Name"
          type="text"
          placeholder="Enter company name"
          value={values.name}
          onChange={set("name")}
        />

        <Field
          label="Website"
          type="text"
          placeholder="https://example.com"
          value={values.website}
          onChange={set("website")}
        />

        <Field
          label="Location"
          type="text"
          placeholder="Bangalore"
          value={values.location}
          onChange={set("location")}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {isEditing ? "Update Company" : "Add Company"}
        </button>

        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CompanyForm;
