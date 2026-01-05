import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let nextId = 4;
let items = [
  {
    id: 1,
    title: "Welcome to Tracker",
    description: "This is a sample item. You can edit or delete it.",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Try creating a new item",
    description: "Use the New Item button to add one.",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 3,
    title: "Mark items as done",
    description: "Edit an item and set status to done.",
    status: "done",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

function normalizeStatus(status) {
  const s = (status || "").toLowerCase();
  return s === "done" ? "done" : "active";
}

function validateItemInput(body) {
  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();
  const status = normalizeStatus(body.status);

  const errors = [];
  if (title.length < 2) errors.push("Title must be at least 2 characters.");
  if (title.length > 120) errors.push("Title must be 120 characters or fewer.");
  if (description.length > 2000) errors.push("Description must be 2000 characters or fewer.");

  return { title, description, status, errors };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, server: "memory", time: new Date().toISOString() });
});

app.get("/api/items", (req, res) => {
  const status = normalizeStatus(req.query.status);
  const q = (req.query.q ?? "").trim().toLowerCase();

  let result = [...items];
  if (req.query.status) {
    result = result.filter((i) => i.status === status);
  }
  if (q) {
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }

  result.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  res.json(result);
});

app.get("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const found = items.find((i) => i.id === id);
  if (!found) return res.status(404).json({ error: "Item not found." });
  res.json(found);
});

app.post("/api/items", (req, res) => {
  const { title, description, status, errors } = validateItemInput(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(" ") });

  const now = new Date().toISOString();
  const newItem = {
    id: nextId++,
    title,
    description,
    status,
    createdAt: now,
    updatedAt: now
  };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return res.status(404).json({ error: "Item not found." });

  const { title, description, status, errors } = validateItemInput(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(" ") });

  const now = new Date().toISOString();
  const updated = {
    ...items[idx],
    title,
    description,
    status,
    updatedAt: now
  };
  items[idx] = updated;
  res.json(updated);
});

app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = items.length;
  items = items.filter((i) => i.id !== id);
  if (items.length === before) return res.status(404).json({ error: "Item not found." });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Memory API running on http://localhost:${PORT}`);
});
