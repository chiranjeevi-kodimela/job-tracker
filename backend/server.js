const app = require("./app");

const PORT = process.env.PORT || 16349;
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
