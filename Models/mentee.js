const express = require('express');
const Mentee = require('./models/mentee');
const app = express();

app.use(express.json());

// Create a mentee
app.post('/mentees', async (req, res) => {
  try {
    const mentee = await Mentee.create(req.body);
    res.status(201).json(mentee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all mentees
app.get('/mentees', async (req, res) => {
  const mentees = await Mentee.findAll();
  res.json(mentees);
});

// Get a single mentee by ID
app.get('/mentees/:id', async (req, res) => {
  const mentee = await Mentee.findByPk(req.params.id);
  if (mentee) res.json(mentee);
  else res.status(404).json({ error: 'Mentee not found' });
});

// Update a mentee by ID
app.put('/mentees/:id', async (req, res) => {
  const mentee = await Mentee.findByPk(req.params.id);
  if (mentee) {
    await mentee.update(req.body);
    res.json(mentee);
  } else res.status(404).json({ error: 'Mentee not found' });
});

// Delete a mentee by ID
app.delete('/mentees/:id', async (req, res) => {
  const mentee = await Mentee.findByPk(req.params.id);
  if (mentee) {
    await mentee.destroy();
    res.status(204).send();
  } else res.status(404).json({ error: 'Mentee not found' });
});


  












// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
