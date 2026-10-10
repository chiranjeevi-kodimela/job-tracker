import { useState } from "react";

import Alert from "../components/Alert";
import Field from "../components/Field";
import PageHeader from "../components/PageHeader";
import PasswordStrength from "../components/PasswordStrength";
import { useAuth } from "../context/useAuth";
import { changePassword, updateProfile } from "../services/api";
import { formatDate } from "../utils/dates";
import { isValidEmail, validatePassword } from "../utils/validation";

function ProfileForm({ user, onSaved }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const unchanged =
    name.trim() === user.name && email.trim().toLowerCase() === user.email;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await updateProfile({ name, email });
      onSaved(data.user);
      setMessage(data.message || "Profile updated successfully.");
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Profile details</h2>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      <Field
        label="Name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <Field
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <p className="field-hint">
        Member since {formatDate(user.created_at, "—")}
      </p>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={submitting || unchanged}
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!currentPassword) {
      setError("Please enter your current password.");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from the current password.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await changePassword(currentPassword, newPassword);
      setMessage(data.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (changeError) {
      setError(changeError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="form card" onSubmit={handleSubmit} noValidate>
      <h2 className="card-title">Change password</h2>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      <Field
        label="Current password"
        type="password"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
      />

      <div>
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <PasswordStrength password={newPassword} />
      </div>

      <Field
        label="Confirm new password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
      />

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Updating..." : "Update password"}
        </button>
      </div>
    </form>
  );
}

function ProfilePage() {
  const { user, updateUser } = useAuth();

  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage your account details and password."
      />

      <div className="profile-grid">
        {user && <ProfileForm user={user} onSaved={updateUser} />}
        <ChangePasswordForm />
      </div>
    </>
  );
}

export default ProfilePage;
