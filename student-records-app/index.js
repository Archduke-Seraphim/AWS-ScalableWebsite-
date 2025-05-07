const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'student-db.c5ezjevlf47w.us-east-1.rds.amazonaws.com', // Change: your own DB host
  user: 'admin', // Change: your own DB username
  password: '#86TNqysaXFN2qPPhvtD', // Change: your own DB password
  database: 'student_db', // Change: your own DB name
  waitForConnections: true,
  connectionLimit: 10,     // Optional: adjust based on expected traffic
  queueLimit: 0            // Optional: leave 0 for unlimited request queue
});

module.exports = pool;

const express = require('express');
const app = express();
const port = process.env.PORT || 5000; // Optional: change default port if needed
const pool = require('./db');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({
  secret: 'super-secret-key', // Change: your own secret string for session security
  resave: false,
  saveUninitialized: true
}));

app.post('/signup', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
          'INSERT INTO students (name, username, password_hash, address, city, state, email, phone) VALUES (?, ?, ?, "N/A", "N/A", "N/A", "N/A", "N/A")', 
          [name, username, hashedPassword]
        ); // Assumes this table schema; Change if your DB structure is different

        res.redirect('/login.html');
    } catch (err) {
        console.error('Signup error:', err);
        res.redirect('/signup.html?error=Something+went+wrong');
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM students WHERE username = ?', [username]); // Change: table name/column if your schema differs
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash); // Change: password column if named differently
            if (match) {
                res.cookie('userId', user.id, { httpOnly: true }); // Change: if your user ID field is named differently
                res.cookie('username', user.username, { httpOnly: true }); // Change: if using different session/user tracking method
                return res.redirect('/');
            }
        }
        res.redirect('/login.html?error=Invalid+username+or+password');
    } catch (err) {
        console.error('Login Error:', err);
        res.redirect('/login.html?error=Something+went+wrong');
    }
});

app.post('/add-student', async (req, res) => {
  try {
    const { name, address, city, state, email, phone } = req.body;
    await pool.query(
      'INSERT INTO students (name, address, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?)', // Change: table/columns if different
      [name, address, city, state, email, phone]
    );
    res.redirect('/students-list.html'); // Change: path if using a different frontend
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).send('Failed to add student');
  }
});

app.get('/check-login', (req, res) => {
  const username = req.cookies.username;
  if (username) {
    res.json({ loggedIn: true, username: username });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.clearCookie('username');
  res.redirect('/');
});

app.get('/students', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students'); // Change: table name if different
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
});

app.get('/student/:id', async (req, res) => {
  const { id } = req.params;
  const cookieUsername = req.cookies.username;
  if (!cookieUsername) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]); // Change: column/table if needed
    if (rows.length === 0) {
      return res.status(404).send('Student not found.');
    }
    const student = rows[0];
    if (student.username !== cookieUsername) {
      return res.status(403).send('Access denied.');
    }
    res.json(student);
  } catch (err) {
    console.error('Fetch student error:', err);
    res.status(500).send('Server error.');
  }
});

app.put('/update-student/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address, city, state, email, phone } = req.body;
  const cookieUsername = req.cookies.username;
  if (!cookieUsername) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE id = ?', [id]); // Change if table or ID column differs
    if (rows.length === 0) {
      return res.status(404).send('Student not found.');
    }
    const student = rows[0];
    if (student.username !== cookieUsername) {
      return res.status(403).send('Access denied.');
    }
    await pool.query(
      'UPDATE students SET name = ?, address = ?, city = ?, state = ?, email = ?, phone = ? WHERE id = ?', 
      [name, address, city, state, email, phone, id]
    ); // Change fields to match your schema
    res.json({ message: 'Student updated successfully.' });
  } catch (err) {
    console.error('Update student error:', err);
    res.status(500).send('Server error updating student.');
  }
});

app.post('/delete-all', async (req, res) => {
  const { password } = req.body;
  const adminPassword = 'SuperSecret123'; // Change: Any password you want
  if (password !== adminPassword) {
    return res.status(401).send('Unauthorized');
  }
  try {
    await pool.query('DELETE FROM students'); // Change: table name if different
    res.send('All students deleted.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting students.');
  }
});

app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Go Home</a></p>'); // Change: customize as needed
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
