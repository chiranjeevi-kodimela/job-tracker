import { useCallback, useEffect, useState } from "react";

import Alert from "../components/Alert";
import CompanyForm from "../components/CompanyForm";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
} from "../services/api";
import { getSafeUrl } from "../utils/url";

function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCompanies = useCallback(async () => {
    const data = await getCompanies();
    setCompanies(data.companies);
  }, []);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        await fetchCompanies();
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [fetchCompanies]);

  const closeForm = () => {
    setShowForm(false);
    setEditingCompany(null);
  };

  const openAddForm = () => {
    setEditingCompany(null);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleFormSubmit = async (companyData) => {
    setError("");
    setMessage("");

    if (editingCompany) {
      await updateCompany(editingCompany.id, companyData);
      setMessage("Company updated successfully.");
    } else {
      await createCompany(companyData);
      setMessage("Company created successfully.");
    }

    await fetchCompanies();
    closeForm();
  };

  const handleDelete = async (company) => {
    const confirmed = window.confirm(
      `Delete ${company.name}? Its applications and interviews will be deleted too.`,
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteCompany(company.id);
      setMessage("Company deleted successfully.");
      await fetchCompanies();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (loading) return <Loading label="Loading companies..." />;

  return (
    <>
      <PageHeader title="Companies" subtitle={`${companies.length} total`}>
        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          + Add Company
        </button>
      </PageHeader>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {showForm && (
        <CompanyForm
          key={editingCompany?.id ?? "new"}
          company={editingCompany}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}

      {companies.length === 0 ? (
        <div className="card">
          <EmptyState title="No companies found">
            Add the companies you're applying to.
          </EmptyState>
        </div>
      ) : (
        <div className="grid">
          {companies.map((company) => {
            const websiteUrl = getSafeUrl(company.website);

            return (
              <article key={company.id} className="card">
                <h2 className="card-title">{company.name}</h2>

                <p className="muted">
                  Website:{" "}
                  {websiteUrl ? (
                    <a href={websiteUrl} target="_blank" rel="noreferrer">
                      {company.website}
                    </a>
                  ) : (
                    company.website || "Not provided"
                  )}
                </p>
                <p className="muted">
                  Location: {company.location || "Not provided"}
                </p>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleEdit(company)}
                    aria-label={`Edit ${company.name}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(company)}
                    aria-label={`Delete ${company.name}`}
                  >
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}

export default CompaniesPage;
