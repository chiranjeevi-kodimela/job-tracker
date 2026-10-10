export const escapeCsv = (value) => {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export const buildCsv = (rows, columns) => {
  const header = columns.map((column) => escapeCsv(column.heading)).join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsv(row[column.key])).join(","),
  );

  return [header, ...lines].join("\r\n");
};

export const downloadCsv = (filename, csvContent) => {
  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};
