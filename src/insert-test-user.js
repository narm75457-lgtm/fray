const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
    process.exit(1);
  }
});

const stmt = `INSERT INTO User (email, name, role) VALUES (?, ?, ?)`;
const email = 'test+ai@example.com';
const name = 'Test AI';
const role = 'tester';

db.run(stmt, [email, name, role], function (err) {
  if (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      console.log('User already exists (unique email):', email);
    } else {
      console.error('Insert error:', err.message);
      db.close();
      process.exit(1);
    }
  } else {
    console.log('Inserted user id:', this.lastID);
  }
  db.close();
});
