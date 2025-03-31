const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./authsystem.db', (err) => {
  if (err) {
    console.error('Error opening database: ', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Create table (if not exists)
const createTable = () => {
  const query = `
    CREATE TABLE IF NOT EXISTS mentees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      fullname TEXT NOT NULL,
      password TEXT NOT NULL
    );
  `;
  db.run(query, (err) => {
    if (err) {
      console.log("Error creating table: ", err.message); // Log error if table creation fails
    } else {
      console.log("Mentees table created (or already exists).");
    }
  });
};

// Insert mentee into the database
const insertMentee = (username, email, fullname, password, callback) => {
  // Check if the email already exists
  const checkEmailQuery = `SELECT * FROM mentees WHERE email = ?`;
  db.get(checkEmailQuery, [email], (err, row) => {
    if (err) {
      return callback(err, null); // Return error if the query fails
    }

    // If email already exists, return error message
    if (row) {
      return callback(new Error("Email already exists!"), null);
    }

    // Insert mentee if email does not exist
    const insertQuery = `INSERT INTO mentees (username, email, fullname, password) VALUES (?, ?, ?, ?)`;
    db.run(insertQuery, [username, email, fullname, password], function (err) {
      if (err) {
        return callback(err, null); // Return error if insert fails
      }
      callback(null, this.lastID); // Return the inserted mentee ID
    });
  });
};

module.exports = { createTable, insertMentee, db };
