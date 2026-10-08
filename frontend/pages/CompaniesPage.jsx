import { useEffect, useState } from "react";

import {
  getCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../src/services/api";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("");

  const [editingCompanyId, setEditingCompanyId] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();

      setCompanies(data.companies);
    } catch (error) {
      console.error("Companies fetch error:", error);

      setError(error.message);
    }
  };

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await getCompanies();

        setCompanies(data.companies);
      } catch (error) {
        console.error("Companies fetch error:", error);

        setError(error.message);
      }
    };

    loadCompanies();
  }, []);
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Company name is required.");
      return;
    }

    const companyData = {
      name,
      website,
      location,
    };

    try {
      if (editingCompanyId) {
        await updateCompany(editingCompanyId, companyData);

        setMessage("Company updated successfully.");

        clearForm();
        fetchCompanies();

        return;
      }

      await createCompany(companyData);

      setMessage("Company created successfully.");

      clearForm();
      fetchCompanies();
    } catch (error) {
      console.error("Company operation error:", error);

      setError(error.message);
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

  const handleDelete = async (companyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteCompany(companyId);

      setMessage("Company deleted successfully.");

      fetchCompanies();
    } catch (error) {
      console.error("Delete company error:", error);

      setError(error.message);
    }
  };

  const clearForm = () => {
    setEditingCompanyId(null);

    setName("");
    setWebsite("");
    setLocation("");
  };

  const handleCancelEdit = () => {
    clearForm();

    setError("");
    setMessage("");
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
