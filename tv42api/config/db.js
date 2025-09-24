const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'news'
});

db.connect(err => {
  if (err) {
    console.error('MySQL bağlantısı hatalı:', err);
    process.exit(1);
  }
  console.log('MySQL bağlantısı başarılı!');
});

module.exports = db;
