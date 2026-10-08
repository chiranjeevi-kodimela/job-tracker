import { useEffect, useState } from "react";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("Current user:", data);

        if (!response.ok) {
          setError(data.message || "Failed to fetch user.");
          return;
        }

        setUser(data.user);
      } catch (error) {
        console.error("User fetch error:", error);
        setError("Unable to connect to the server.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Welcome, {user.name}</h2>

      <p>Email: {user.email}</p>
      <p>User ID: {user.id}</p>
    </div>
  );
}

export default DashboardPage;
