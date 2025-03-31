const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createTable, insertMentee, db } = require('./database'); // Import db from database.js

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize the database table
createTable(); // Ensure the table is created when the server starts

// Route to create a mentee
app.post('/api/mentees', (req, res) => {
  const { username, email, fullname, password } = req.body;

  // Call insertMentee function from database.js
  insertMentee(username, email, fullname, password, (err, menteeId) => {
    if (err) {
      return res.status(400).json({ message: "Error inserting mentee", error: err.message });
    }
    res.status(201).json({ message: "Mentee created successfully", menteeId });
  });
});




// Get mentee by ID
app.get('/api/mentees/:id', (req, res) => {
  const menteeId = req.params.id;
  
  // Query the database to get the mentee details by ID
  const query = 'SELECT * FROM mentees WHERE id = ?';
  db.get(query, [menteeId], (err, row) => {
    if (err) {
      console.error("Error fetching mentee details:", err.message); // Log the error
      return res.status(500).json({ message: 'Error fetching mentee details', error: err.message });
    }
    if (!row) {
      console.log("No mentee found with ID:", menteeId); // Log when no record is found
      return res.status(404).json({ message: 'Mentee not found' });
    }
    console.log("Fetched mentee:", row); // Log the result
    res.status(200).json({ mentee: row });
  });
});




// Update mentee details
// Update mentee details
app.put('/api/mentees/:id', (req, res) => {
    const menteeId = req.params.id;
    const { username, email, fullname, password } = req.body;
  
    // Construct the query dynamically to only update the fields that are provided
    let query = 'UPDATE mentees SET';
    const values = [];
    
    if (username) {
      query += ' username = ?,';
      values.push(username);
    }
  
    if (email) {
      query += ' email = ?,';
      values.push(email);
    }
  
    if (fullname) {
      query += ' fullname = ?,';
      values.push(fullname);
    }
  
    if (password) {
      query += ' password = ?,';
      values.push(password);
    }
  
    // Remove the trailing comma from the query
    query = query.slice(0, -1);
  
    // Append the WHERE clause to the query
    query += ' WHERE id = ?';
    values.push(menteeId);
  
    // Run the update query
    db.run(query, values, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error updating mentee details', error: err.message });
      }
  
      if (this.changes === 0) {
        // No record was updated, meaning the mentee ID does not exist
        return res.status(404).json({ message: 'Mentee not found' });
      }
  
      res.status(200).json({ message: 'Mentee details updated successfully', menteeId });
    });
  });

  




// Delete a mentee by ID
app.delete('/api/mentees/:id', (req, res) => {
    const menteeId = req.params.id;
  
    // Delete query to remove mentee from the database
    const query = 'DELETE FROM mentees WHERE id = ?';
  
    db.run(query, [menteeId], function (err) {
      if (err) {
        return res.status(500).json({ message: 'Error deleting mentee', error: err.message });
      }
  
      if (this.changes === 0) {
        // No record was deleted, meaning the mentee ID does not exist
        return res.status(404).json({ message: 'Mentee not found' });
      }
  
      res.status(200).json({ message: 'Mentee deleted successfully', menteeId });
    });
});

// List all mentees
app.get('/api/mentees', (req, res) => {
    const query = 'SELECT * FROM mentees';  // Query to get all mentees
  
    db.all(query, [], (err, rows) => { // `db.all` will fetch all records
      if (err) {
        console.error("Error fetching all mentees:", err.message); // Log the error
        return res.status(500).json({ message: 'Error fetching all mentees', error: err.message });
      }
      if (rows.length === 0) {
        return res.status(404).json({ message: 'No mentees found' });
      }
      res.status(200).json({ mentees: rows });
    });
  });
 
  







app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
  
    // Query the database for the mentee by email
    const query = 'SELECT * FROM mentees WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err) {
        console.error("Error fetching user:", err.message);
        return res.status(500).json({ message: 'Error fetching user', error: err.message });
      }
  
      if (!row) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare passwords (assuming plaintext comparison for simplicity, but should be hashed)
      if (row.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Return the user data if login is successful
      res.status(200).json({
        message: 'Login successful',
        mentees: {
          id: row.id,
          username: row.username,
          email: row.email,
          fullname: row.fullname
        }
      });
    });
  });
  











// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
