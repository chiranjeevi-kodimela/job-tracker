import { Link, useNavigate } from "react-router-dom";

function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/login");
  };

  return (
    <nav>
      <h2>
        <Link to="/dashboard">Job Tracker</Link>
      </h2>

      <p>Welcome, {username}</p>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        {" | "}

        <Link to="/companies">Companies</Link>
        {" | "}

        <Link to="/applications">Applications</Link>
        {" | "}

        <Link to="/interviews">Interviews</Link>
        {" | "}

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
