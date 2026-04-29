const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const ADMIN_KEY = "messi2be";
const USER_KEY = "Jay";

const DB = path.join(__dirname, "apps.json");

// ensure apps.json exists
if (!fs.existsSync(DB)) {
  fs.writeFileSync(DB, "[]");
}

// helpers
function readApps() {
  return JSON.parse(fs.readFileSync(DB, "utf8"));
}

function saveApps(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

//
// ✅ SERVE FRONTEND
//
app.use(express.static(path.join(__dirname, "public")));

//
// ✅ API ROUTES
//

// login
app.post("/login", (req, res) => {
  const { key } = req.body;

  if (key === ADMIN_KEY) {
    return res.json({ ok: true, role: "admin" });
  }

  if (key === USER_KEY) {
    return res.json({ ok: true, role: "user" });
  }

  return res.json({ ok: false });
});

// get apps
app.get("/apps", (req, res) => {
  res.json(readApps());
});

// update apps (admin only)
app.post("/apps", (req, res) => {
  const { key, apps } = req.body;

  if (key !== ADMIN_KEY) {
    return res.status(403).json({ error: "forbidden" });
  }

  saveApps(apps);
  res.json({ ok: true });
});

//
// ✅ ROOT ROUTE (fixes "Cannot GET /")
//

// send your frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//
// ✅ FALLBACK (important for SPA behavior)
//
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

//
// ✅ START SERVER (RENDER COMPATIBLE)
//
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Jay OS running on port " + PORT);
});
