import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Alert from "../components/Alert";
import ApplicationForm from "../components/ApplicationForm";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import { APPLICATION_STATUSES } from "../constants";
import {
  createApplication,
  deleteApplication,
  getApplications,
  getCompanies,
  updateApplication,
} from "../services/api";
import {
  APPLICATION_CSV_COLUMNS,
  filterAndSortApplications,
  paginate,
} from "../utils/applications";
import { buildCsv, downloadCsv } from "../utils/csv";
import { formatDate } from "../utils/dates";

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // The details page links here with ?edit=<id>
  const [searchParams, setSearchParams] = useSearchParams();
  const editParam = searchParams.get("edit");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchApplications = useCallback(async () => {
    const data = await getApplications();
    setApplications(data.applications);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [applicationsData, companiesData] = await Promise.all([
          getApplications(),
          getCompanies(),
        ]);

        setApplications(applicationsData.applications);
        setCompanies(companiesData.companies);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeEditId = editingId ?? editParam;
  const editingApplication = activeEditId
    ? applications.find(
        (application) => String(application.id) === String(activeEditId),
      )
    : null;
  const formOpen = showForm || Boolean(editingApplication);

  const filteredApplications = filterAndSortApplications(applications, {
    searchTerm,
    statusFilter,
    sortBy,
  });

  const {
    page,
    totalPages,
    startIndex,
    items: paginatedApplications,
  } = paginate(filteredApplications, currentPage, pageSize);

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    if (editParam) setSearchParams({}, { replace: true });
  };

  const openAddForm = () => {
    setEditingId(null);
    setShowForm(true);
    setError("");
    setMessage("");
    if (editParam) setSearchParams({}, { replace: true });
  };

  const handleEdit = (application) => {
    setEditingId(application.id);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleFormSubmit = async (applicationData) => {
    setError("");
    setMessage("");

    if (editingApplication) {
      await updateApplication(editingApplication.id, applicationData);
      setMessage("Application updated successfully.");
    } else {
      await createApplication(applicationData);
      setMessage("Application created successfully.");
      setCurrentPage(1);
    }

    await fetchApplications();
    closeForm();
  };

  const handleDelete = async (applicationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteApplication(applicationId);
      setMessage("Application deleted successfully.");
      await fetchApplications();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleExportCSV = () => {
    if (filteredApplications.length === 0) {
      setError("There are no applications to export.");
      setMessage("");
      return;
    }

    downloadCsv(
      "job-applications.csv",
      buildCsv(filteredApplications, APPLICATION_CSV_COLUMNS),
    );

    setError("");
    setMessage(
      `Exported ${filteredApplications.length} application(s) to CSV.`,
    );
  };

  // Resets to page 1 whenever a filter changes
  const onFilter =
    (setter, transform = (value) => value) =>
    (event) => {
      setter(transform(event.target.value));
      setCurrentPage(1);
    };

  if (loading) return <Loading label="Loading applications..." />;

  return (
    <>
      <PageHeader
        title="Applications"
        subtitle={`${applications.length} total`}
      >
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleExportCSV}
        >
          Export to CSV
        </button>
        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          + Add Application
        </button>
      </PageHeader>

      <Alert>{error}</Alert>
      <Alert type="success">{message}</Alert>

      {formOpen && (
        <ApplicationForm
          key={editingApplication?.id ?? "new"}
          companies={companies}
          application={editingApplication}
          onSubmit={handleFormSubmit}
          onCancel={closeForm}
        />
      )}

      <div className="card toolbar">
        <input
          type="search"
          aria-label="Search applications"
          placeholder="Search by job title or company"
          value={searchTerm}
          onChange={onFilter(setSearchTerm)}
        />

        <select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={onFilter(setStatusFilter)}
        >
          <option value="All">All Statuses</option>
          {APPLICATION_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          aria-label="Sort by"
          value={sortBy}
          onChange={onFilter(setSortBy)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="jobTitle">Job Title (A–Z)</option>
          <option value="company">Company (A–Z)</option>
        </select>

        <select
          aria-label="Applications per page"
          value={pageSize}
          onChange={onFilter(setPageSize, Number)}
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="card">
          <EmptyState title="No applications found">
            {applications.length === 0
              ? "Add your first application to get started."
              : "Try a different search or filter."}
          </EmptyState>
        </div>
      ) : (
        <div className="card table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Applied</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedApplications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <Link to={`/applications/${application.id}`}>
                        <strong>{application.job_title}</strong>
                      </Link>
                    </td>
                    <td>{application.company_name}</td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>{formatDate(application.applied_date, "—")}</td>
                    <td className="row-actions">
                      <Link to={`/applications/${application.id}`}>
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="link-button"
                        onClick={() => handleEdit(application)}
                        aria-label={`Edit ${application.job_title}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="link-danger"
                        onClick={() => handleDelete(application.id)}
                        aria-label={`Delete ${application.job_title}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <p className="muted">
              Showing {startIndex + 1}–
              {Math.min(startIndex + pageSize, filteredApplications.length)} of{" "}
              {filteredApplications.length} applications
            </p>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ApplicationsPage;
