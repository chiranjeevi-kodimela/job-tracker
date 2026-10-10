import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";

function NotFoundPage() {
  return (
    <div className="container">
      <EmptyState title="Page not found">
        The page you're looking for doesn't exist.{" "}
        <Link to="/dashboard">Go to the dashboard</Link>
      </EmptyState>
    </div>
  );
}

export default NotFoundPage;
