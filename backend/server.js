const app = require("./app");

const PORT = process.env.PORT || 16349;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
