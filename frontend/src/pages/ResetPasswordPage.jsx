import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordStrength from "../components/PasswordStrength";
import { resetPassword } from "../services/api";
import { validatePassword } from "../utils/validation";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!token) {
    return (
      <AuthLayout
        title="Reset link missing"
        footer={<Link to="/forgot-password">Request a new reset link</Link>}
      >
        <Alert>This password reset link is incomplete. Please request a new one.</Alert>
      </AuthLayout>
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await resetPassword(token, password);
      navigate("/login", { replace: true, state: { message: data.message } });
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Choose a new password"
      subtitle="Pick something you haven't used before."
      footer={<Link to="/login">Back to login</Link>}
    >
      <Alert>{error}</Alert>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div>
          <Field
            label="New password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength password={password} />
        </div>

        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
