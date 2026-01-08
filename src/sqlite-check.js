const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'prisma', 'dev.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('No se pudo abrir la base de datos:', err.message);
    process.exit(1);
  }
});

db.all('SELECT id, email, name, role FROM User', (err, rows) => {
  if (err) {
    console.error('Error consultando User:', err.message);
    db.close();
    process.exit(1);
  }

  console.log('Usuarios encontrados:', rows);
  db.close();
});
