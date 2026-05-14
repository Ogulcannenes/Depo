const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./src/database/database.db", (err) => {
  if (err) {
    console.log("Database bağlantı hatası", err.message);
  } else {
    console.log("SQLite database bağlandı");
  }
});

db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        stock INTEGER
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS stock_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        old_stock INTEGER,
        new_stock INTEGER,
        changed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
    )
`);

module.exports = db;
