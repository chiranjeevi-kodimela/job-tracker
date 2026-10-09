import { useState } from "react";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const registerData = {
      name,
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      console.log("Register response:", data);

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }
      console.log("Registration successfull");
    } catch (error) {
      console.error("Registration error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div>
      <h1>Register</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <br />
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
