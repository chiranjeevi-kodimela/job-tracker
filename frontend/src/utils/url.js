// Only http(s) links are rendered as <a href> (blocks javascript: URLs etc.).
// A bare domain like "example.com" is upgraded to https://example.com.
export const getSafeUrl = (value) => {
  const text = String(value || "").trim();
  if (!text) return null;

  if (/^https?:\/\//i.test(text)) return text;
  if (/^[\w-]+(\.[\w-]+)+(\/.*)?$/i.test(text)) return `https://${text}`;

  return null;
};
