
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const connection = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME
});

connection.connect(function() {
  connection.query('CREATE TABLE IF NOT EXISTS students (id INTEGER AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, school_name VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, licensed TINYINT);');
});

const app = express();
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(express.static('public'));

app.post('/api/students/add', (req, res) => {
  if(!req.body) {
    throw 'No data received.';
  }

  const values = [
    req.body.first_name,
    req.body.last_name,
    req.body.username,
    req.body.school_name
  ];

  for(let i = 0; i < values.length; i++) {
    values[i] = values[i].toString().trim();

    if(!values[i]) {
      throw 'Missing required value.';
    }
  }

  values.push(req.body.licensed ? 1 : 0);

  connection.query(
    'INSERT INTO students (first_name, last_name, username, school_name, licensed) VALUES (?, ?, ?, ?, ?)', 
    values, 
    (error, results) => {
      if(error) {
        throw error;
      }

      res.json({
        id: results.insertId
      });
    }
  );
});

app.post('/api/students/:id/update', (req, res) => {
  let studentID = req.params.id;

  if(!studentID) {
    throw 'Missing student ID.';
  }

  studentID = parseInt(studentID.trim());
  
  if(!studentID) {
    throw 'Invalid student ID.';
  }

  if(!req.body) {
    throw 'No data provided.';
  }

  const fields = {};

  if(req.body.first_name && req.body.first_name.trim()) {
    fields['first_name'] = (req.body.first_name.trim());
  }

  if(req.body.last_name && req.body.last_name.trim()) {
    fields['last_name'] = (req.body.last_name.trim());
  }

  if(req.body.username && req.body.username.trim()) {
    fields['username'] = (req.body.username.trim());
  }

  if(req.body.school_name && req.body.school_name.trim()) {
    fields['school_name'] = (req.body.school_name.trim());
  }

  if(req.body.hasOwnProperty('licensed')) {
    fields['licensed'] = parseInt(req.body.licensed) === 1 ? 1 : 0;
  }

  const segments = [];
  const values = [];

  for(let field in fields) {
    segments.push(field + ' = ?');
    values.push(fields[field]);
  }

  if(segments.length === 0) {
    throw 'No data provided.';
  }

  values.push(studentID);

  connection.query(
    'UPDATE students SET ' + segments.join(', ') + ' WHERE id = ?', 
    values, 
    (error) => {
      if(error) {
        throw error;
      }

      res.json({
        id: studentID,
        values: fields
      });
  });
});

app.delete('/api/students/:id/delete', (req, res) => {
  let studentID = req.params.id;

  if(!studentID) {
    throw 'Missing student ID.';
  }

  studentID = parseInt(studentID.trim());
  
  if(!studentID) {
    throw 'Invalid student ID.';
  }

  connection.query('DELETE FROM students WHERE id = ? LIMIT 1;', [studentID], (error, result) => {
    if(error) {
      throw error;
    }

    res.json({
      id: studentID
    });
  });
});

app.get('/api/students', (_, res) => {
  connection.query('SELECT * FROM students ORDER BY id ASC;', (error, rows) => {
    if (error) {
      throw error
    }
  
    res.json(rows);
  });
});

app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

connection.connect();

app.listen(process.env.PORT, () => {
  console.log('API server started.');
});