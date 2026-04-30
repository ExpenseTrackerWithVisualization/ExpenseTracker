const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath);

// Ensure schema is correct
try {
  // Check if type column exists, if not add it, and alter id to TEXT if possible, 
  // but sqlite doesn't allow altering column type easily. 
  // Let's just create a new table if it doesn't exist, or migrate.
  // To be safe, we will just use a new table called transactions
  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'expense'
    );
  `);
} catch (err) {
  console.error("Migration error:", err);
}

app.get('/api/transactions', (req, res) => {
  try {
    const transactions = db.prepare('SELECT * FROM transactions').all();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transactions', (req, res) => {
  try {
    const { id, description, amount, category, date, type } = req.body;
    const stmt = db.prepare('INSERT INTO transactions (id, description, amount, category, date, type) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(id, description, amount, category, date, type || 'expense');
    res.status(201).json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/transactions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, category, date, type } = req.body;
    const stmt = db.prepare('UPDATE transactions SET description = ?, amount = ?, category = ?, date = ?, type = ? WHERE id = ?');
    stmt.run(description, amount, category, date, type, id);
    res.json(req.body);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/transactions/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM transactions WHERE id = ?');
    stmt.run(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
