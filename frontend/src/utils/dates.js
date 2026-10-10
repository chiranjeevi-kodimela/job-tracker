// Local-time YYYY-MM-DD (toISOString() would use UTC and can be off by a day)
export const toISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Accepts 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm:ss...' or null
export const toDateInputValue = (value) => (value ? String(value).slice(0, 10) : "");

export const toTimeInputValue = (value) => (value ? String(value).slice(0, 5) : "");

export const formatDate = (value, fallback = "Not provided") => {
  if (!value) return fallback;

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (value, fallback = "Time not set") =>
  value ? String(value).slice(0, 5) : fallback;
