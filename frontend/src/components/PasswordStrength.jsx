import { getPasswordStrength } from "../utils/validation";

const LABELS = ["Too short", "Weak", "Okay", "Good", "Strong"];

function PasswordStrength({ password }) {
  if (!password) return null;

  const score = getPasswordStrength(password);

  return (
    <div className="strength" data-score={score}>
      <div className="strength-bar" aria-hidden="true">
        <span style={{ width: `${(score / 4) * 100}%` }} />
      </div>
      <span className="strength-label">Strength: {LABELS[score]}</span>
    </div>
  );
}

export default PasswordStrength;
