const express = require('express');
const path = require('path');
const dbcon = require('./database').dbconn;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'form.html'));
});

app.get('/users', (req, res) => { 
    const sql = 'SELECT * FROM user1';
    dbcon.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.json(result);
    });
});

app.post('/users1', (req, res) => {
    const { name, password, profession } = req.body;

    if (!name || !password || !profession) {
        return res.status(400).send('Name, password, and profession are required');
    }

    const sql = INSERT INTO user1 (name, password, profession) VALUES (?, ?, ?);
    const values = [name, password, profession];

    dbcon.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            return res.status(500).send('Internal Server Error. Failed to add user.');
        }
        res.status(201).send('User added successfully');
    });
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    const sql = DELETE FROM user1 WHERE id = ${userId};

    dbcon.query(sql, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Internal Server Error. Failed to delete user.');
        }
        res.status(200).send('User deleted successfully');
    });
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, password, profession } = req.body;

    if (!name && !password && !profession) {
        return res.status(400).send('At least one field is required to update');
    }

    let sql = 'UPDATE user1 SET ';
    const updateFields = [];
    const values = [];
    if (name) {
        updateFields.push('name = ?');
        values.push(name);
    }
    if (password) {
        updateFields.push('password = ?');
        values.push(password);
    }
    if (profession) {
        updateFields.push('profession = ?');
        values.push(profession);
    }
    values.push(userId); 
    sql += updateFields.join(', ') + ' WHERE id = ?';
    dbcon.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        res.status(200).send('User updated successfully');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
