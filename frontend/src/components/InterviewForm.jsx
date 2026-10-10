import { useState } from "react";

import { INTERVIEW_TYPES } from "../constants";
import { toDateInputValue, toTimeInputValue } from "../utils/dates";
import Field from "./Field";

const toFormValues = (interview) => ({
  applicationId: interview ? String(interview.application_id) : "",
  interviewType: interview?.interview_type || "",
  interviewDate: toDateInputValue(interview?.interview_date),
  interviewTime: toTimeInputValue(interview?.interview_time),
  meetingLink: interview?.meeting_link || "",
  interviewer: interview?.interviewer || "",
  notes: interview?.notes || "",
});

function InterviewForm({ applications, interview, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(interview));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(interview);

  const set = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!values.applicationId) {
      setError("Please select an application.");
      return;
    }

    if (!values.interviewType.trim()) {
      setError("Interview type is required.");
      return;
    }

    if (!values.interviewDate) {
      setError("Interview date is required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        application_id: Number(values.applicationId),
        interview_type: values.interviewType,
        interview_date: values.interviewDate,
        interview_time: values.interviewTime || null,
        meeting_link: values.meetingLink,
        interviewer: values.interviewer,
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
        {isEditing ? "Edit Interview" : "Schedule Interview"}
      </h2>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-grid">
        <Field
          as="select"
          label="Application"
          value={values.applicationId}
          onChange={set("applicationId")}
        >
          <option value="">Select Application</option>
          {applications.map((application) => (
            <option key={application.id} value={application.id}>
              {application.job_title} - {application.company_name}
            </option>
          ))}
        </Field>

        <Field
          as="select"
          label="Interview Type"
          value={values.interviewType}
          onChange={set("interviewType")}
        >
          <option value="">Select Interview Type</option>
          {INTERVIEW_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Field>

        <Field
          label="Interview Date"
          type="date"
          value={values.interviewDate}
          onChange={set("interviewDate")}
        />

        <Field
          label="Interview Time"
          type="time"
          value={values.interviewTime}
          onChange={set("interviewTime")}
        />

        <Field
          label="Meeting Link"
          type="url"
          placeholder="https://meet.google.com/..."
          value={values.meetingLink}
          onChange={set("meetingLink")}
        />

        <Field
          label="Interviewer"
          type="text"
          placeholder="Interviewer name"
          value={values.interviewer}
          onChange={set("interviewer")}
        />
      </div>

      <Field
        as="textarea"
        label="Notes"
        rows="3"
        placeholder="Interview preparation notes"
        value={values.notes}
        onChange={set("notes")}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {isEditing ? "Update Interview" : "Schedule Interview"}
        </button>

        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default InterviewForm;
