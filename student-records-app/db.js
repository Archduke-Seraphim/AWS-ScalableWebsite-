const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'student-db.c5ezjevlf47w.us-east-1.rds.amazonaws.com', // Your Host Name
  user: 'admin', // Your Username
  password: '#86TNqysaXFN2qPPhvtD', // Your Password
  database: 'student_db', // Your Database Name
  waitForConnections: true,
  connectionLimit: 10,     // Adjustable
  queueLimit: 0            // Unlimited request queue
});

module.exports = pool;
