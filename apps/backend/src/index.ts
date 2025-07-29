import app from "./app";

const PORT = 4000;

app.get("/api/message", (_req, res) => {
  res.json({ message: "Hello from Backend 👋" });
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
