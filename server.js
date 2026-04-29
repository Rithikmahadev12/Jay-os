const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ADMIN_KEY = 'messi2be';
const USER_KEY = 'Jay';
const DB = './apps.json';

if (!fs.existsSync(DB)) fs.writeFileSync(DB, '[]');

const readApps = () => JSON.parse(fs.readFileSync(DB));
const saveApps = (data) => fs.writeFileSync(DB, JSON.stringify(data, null, 2));

app.post('/login', (req, res) => {
  const { key } = req.body;

  if (key === ADMIN_KEY) return res.json({ ok: true, role: 'admin' });
  if (key === USER_KEY) return res.json({ ok: true, role: 'user' });

  res.json({ ok: false });
});

app.get('/apps', (req, res) => {
  res.json(readApps());
});

app.post('/apps', (req, res) => {
  const { key, apps } = req.body;
  if (key !== ADMIN_KEY) return res.status(403).send('forbidden');

  saveApps(apps);
  res.json({ ok: true });
});

app.listen(3000, () => console.log('Running on http://localhost:3000'));
