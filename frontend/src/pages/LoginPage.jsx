import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import Alert from "../components/Alert";
import AuthLayout from "../components/AuthLayout";
import Field from "../components/Field";
import { useAuth } from "../context/useAuth";
import { loginUser } from "../services/api";

function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await loginUser({ email, password });
      login(data.token, data.user);
      navigate(location.state?.from || "/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to track your applications."
      footer={
        <>
          Don't have an account? <Link to="/register">Register here</Link>
        </>
      }
    >
      <Alert type="success">{location.state?.message}</Alert>
      <Alert>{error}</Alert>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <Field
          label="Password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="auth-row">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
