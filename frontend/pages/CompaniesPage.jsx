import { useEffect, useState } from "react";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCompanies = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch companies.");
        return;
      }

      setCompanies(data.companies);
    } catch (error) {
      console.error("Companies fetch error:", error);
      setError("Unable to connect to the server.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Company name is required.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      // UPDATE
      if (editingCompanyId) {
        const response = await fetch(
          `http://localhost:5000/api/companies/${editingCompanyId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name,
              website,
              location,
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Failed to update company.");
          return;
        }

        setMessage("Company updated successfully.");

        setEditingCompanyId(null);
        setName("");
        setWebsite("");
        setLocation("");

        fetchCompanies();

        return;
      }

      // CREATE
      const response = await fetch("http://localhost:5000/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          website,
          location,
        }),
      });

      const data = await response.json();

      console.log("Create company response:", data);

      if (!response.ok) {
        setError(data.message || "Failed to create company.");
        return;
      }

      setMessage("Company created successfully.");

      setName("");
      setWebsite("");
      setLocation("");

      fetchCompanies();
    } catch (error) {
      console.error("Company operation error:", error);
      setError("Unable to connect to the server.");
    }
  };

  const handleEdit = (company) => {
    setEditingCompanyId(company.id);
    setName(company.name);
    setWebsite(company.website || "");
    setLocation(company.location || "");

    setError("");
    setMessage("");
  };

  const handleCancelEdit = () => {
    setEditingCompanyId(null);

    setName("");
    setWebsite("");
    setLocation("");

    setError("");
    setMessage("");
  };

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${companyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to delete company.");
        return;
      }

      setMessage("Company deleted successfully.");

      fetchCompanies();
    } catch (error) {
      console.error("Delete company error:", error);
      setError("Unable to connect to the server.");
    }
  };

  return (
    <div>
      <h1>Companies</h1>

      {error && <p>{error}</p>}

      {message && <p>{message}</p>}

      <h2>{editingCompanyId ? "Edit Company" : "Add Company"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name</label>
          <br />

          <input
            type="text"
            placeholder="Enter company name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Website</label>
          <br />

          <input
            type="text"
            placeholder="https://example.com"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Location</label>
          <br />

          <input
            type="text"
            placeholder="Bangalore"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        <br />

        <button type="submit">
          {editingCompanyId ? "Update Company" : "Add Company"}
        </button>

        {editingCompanyId && (
          <>
            {" "}
            <button type="button" onClick={handleCancelEdit}>
              Cancel
            </button>
          </>
        )}
      </form>

      <hr />

      <h2>My Companies</h2>

      {companies.length === 0 && <p>No companies found.</p>}

      {companies.map((company) => (
        <div key={company.id}>
          <h3>{company.name}</h3>
          <p>Website: {company.website || "Not provided"}</p>
          <p>Location: {company.location || "Not provided"}</p>
          <button onClick={() => handleEdit(company)}>Edit</button>{" "}
          <button onClick={() => handleDelete(company.id)}>Delete</button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default CompaniesPage;
