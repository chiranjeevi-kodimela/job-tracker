import { Link } from "react-router-dom";

function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <Link to="/login" className="brand auth-brand">
          Job Tracker
        </Link>

        <h1 className="auth-title">{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}

        {children}

        {footer && <p className="auth-footer">{footer}</p>}
      </div>
    </div>
  );
}

export default AuthLayout;
