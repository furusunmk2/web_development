const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql2 = require('mysql2');
const bcrypt = require('bcrypt');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

const db = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory_db2'
});
db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      return res.status(500).send('Server error');
    }
    if (result.length > 0) {
      const user = result[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).send('Server error');
        }
        if (isMatch) {
          return res.status(200).send('Login successful');
        } else {
          return res.status(401).send('Invalid credentials');
          
        }
      });
    } else {
      return res.status(401).send('Invalid credentials');
    }
  });
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const checkUserSql = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserSql, [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
        res.status(400).send('Username already exists');
    } else {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) throw err;
            const insertUserSql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            db.query(insertUserSql, [username, hash], (err, result) => {
                if (err) throw err;
                res.send('User registered');
            });
        });
    }
});
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
