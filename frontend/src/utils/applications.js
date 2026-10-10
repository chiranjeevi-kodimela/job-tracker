import { APPLICATION_STATUSES } from "../constants";

export const filterAndSortApplications = (
  applications,
  { searchTerm = "", statusFilter = "All", sortBy = "newest" } = {},
) => {
  const search = searchTerm.toLowerCase().trim();

  return applications
    .filter((application) => {
      const matchesSearch =
        (application.job_title || "").toLowerCase().includes(search) ||
        (application.company_name || "").toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "jobTitle":
          return (a.job_title || "").localeCompare(b.job_title || "");
        case "company":
          return (a.company_name || "").localeCompare(b.company_name || "");
        default:
          return 0;
      }
    });
};

export const paginate = (items, currentPage, pageSize) => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (page - 1) * pageSize;

  return {
    page,
    totalPages,
    startIndex,
    items: items.slice(startIndex, startIndex + pageSize),
  };
};

export const getPageNumbers = (currentPage, totalPages, maxButtons = 5) => {
  if (totalPages <= maxButtons + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxButtons / 2);
  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  if (currentPage <= half + 1) end = maxButtons;
  if (currentPage >= totalPages - half) start = totalPages - maxButtons + 1;

  const pages = [1];
  if (start > 2) pages.push("…");
  for (let page = start; page <= end; page += 1) pages.push(page);
  if (end < totalPages - 1) pages.push("…");
  pages.push(totalPages);

  return pages;
};

export const countByStatus = (applications) =>
  APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status)
      .length,
  }));

export const APPLICATION_CSV_COLUMNS = [
  { heading: "Application ID", key: "id" },
  { heading: "Company", key: "company_name" },
  { heading: "Job Title", key: "job_title" },
  { heading: "Status", key: "status" },
  { heading: "Applied Date", key: "applied_date" },
  { heading: "Job URL", key: "job_url" },
  { heading: "Job Description", key: "job_description" },
  { heading: "Notes", key: "notes" },
  { heading: "Created At", key: "created_at" },
];
