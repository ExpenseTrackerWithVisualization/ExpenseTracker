const Database = require('better-sqlite3');
const path = require('path');

// Create a new database file in the root directory
const dbPath = path.join(__dirname, 'expenses.db');
const db = new Database(dbPath, { verbose: console.log });

console.log('Database connected/created successfully at', dbPath);

// Create the tables with required fields
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);
  
  // Also create a categories table just in case they need it
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
  `);
  
  console.log('Tables created successfully.');
  
  // Insert some default categories if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM categories').get();
  if (count.count === 0) {
    const insertCat = db.prepare('INSERT INTO categories (name) VALUES (?)');
    const defaultCategories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
    defaultCategories.forEach(cat => insertCat.run(cat));
    console.log('Default categories inserted.');
  }

} catch (err) {
  console.error('Error creating database tables:', err);
} finally {
  db.close();
  console.log('Database connection closed.');
}
