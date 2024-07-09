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
          return res.status(200).json({ userId: user.id, username: user.username });
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
          res.status(200).send('User registered');
        });
      });
    }
  });
});

app.post('/addList', (req, res) => {
  const { userId, listName } = req.body;
  const insertInventorySql = 'INSERT INTO inventories (user_id, name, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';
  db.query(insertInventorySql, [userId, listName], (err, result) => {
    if (err) throw err;
    const inventoryId = result.insertId;
    res.status(200).send({ message: 'List added successfully', inventoryId });
  });
});

app.get('/inventories', (req, res) => {
  const { userId } = req.query;
  const query = 'SELECT id, name FROM inventories WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.status(200).send(results);
  });
});

app.post('/addItem', (req, res) => {
  const { listId, itemName, quantity } = req.body;
  const query = 'INSERT INTO products (inventory_id, name, stock, active, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())';
  db.query(query, [listId, itemName, quantity, true], (err, result) => {
    if (err) throw err;
    res.status(200).send({ message: 'Item added successfully', itemId: result.insertId });
  });
});

app.get('/products', (req, res) => {
  const { listId } = req.query;
  const query = 'SELECT * FROM products WHERE inventory_id = ?';
  db.query(query, [listId], (err, results) => {
    if (err) throw err;
    res.status(200).send(results);
  });
});

app.put('/updateItem', (req, res) => {
  const { itemId, quantity, active } = req.body;
  const query = 'UPDATE products SET stock = ?, active = ?, updated_at = NOW() WHERE id = ?';
  db.query(query, [quantity, active, itemId], (err) => {
    if (err) throw err;
    res.status(200).send({ message: 'Item updated successfully' });
  });
});

app.delete('/deleteItem', (req, res) => {
  const { itemId } = req.body;
  const query = 'DELETE FROM products WHERE id = ?';
  db.query(query, [itemId], (err) => {
    if (err) throw err;
    res.status(200).send({ message: 'Item deleted successfully' });
  });
});

app.delete('/deleteList', (req, res) => {
  const { listId } = req.body;
  const deleteProductsSql = 'DELETE FROM products WHERE inventory_id = ?';
  db.query(deleteProductsSql, [listId], (err) => {
    if (err) throw err;
    const deleteListSql = 'DELETE FROM inventories WHERE id = ?';
    db.query(deleteListSql, [listId], (err) => {
      if (err) throw err;
      res.status(200).send({ message: 'List and its items deleted successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
