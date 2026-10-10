import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from "../context/useAuth";
import { registerUser } from "../services/api";
import { isValidEmail, validatePassword } from "../utils/validation";

function RegisterPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSubmitting(true);
    try {
      await registerUser({ name, email, password });
      navigate("/login", {
        replace: true,
        state: { message: "Account created. Please log in." },
      });
    } catch (registerError) {
      setError(registerError.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organising your job search."
      footer={
        <>
          Already have an account? <Link to="/login">Login here</Link>
        </>
      }
    >
      <Alert>{error}</Alert>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Name"
          type="text"
          placeholder="Enter your name"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div>
          <Field
            label="Password"
            type="password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <PasswordStrength password={password} />
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default RegisterPage;
