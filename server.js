const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const mongoUri = '';
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Atlas Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
});
const Student = mongoose.model('Student', studentSchema);
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).send(newStudent);
  } catch (err) {
    res.status(400).send({ error: 'Error creating student' });
  }
});
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send({ error: 'Error fetching students' });
  }
});
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.status(200).send(updatedStudent);
  } catch (err) {
    res.status(400).send({ error: 'Error updating student' });
  }
});
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).send({ error: 'Student not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send({ error: 'Error deleting student' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
