// NPM Packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// HTML ROUTES

// Get index.html
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Get notes.html
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// API ROUTES

// Get all notes
app.get('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  res.json(notes);
});

// Create note
app.post('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let newNote = req.body
  newNote.id = uuid();
  let allNotes = [...notes, newNote];

  fs.writeFileSync('./db/db.json', JSON.stringify(allNotes))
  console.log(`Created note ${newNote.id}`);

  res.json(allNotes);
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  let deleteNote = req.params.id;
  let notes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let updatedNotes = notes.filter((note) => note.id != deleteNote);

  fs.writeFileSync('./db/db.json', JSON.stringify(updatedNotes));
  console.log(`Deleted note ${deleteNote}`);

  res.json(updatedNotes);
});

// App listening on port 3000
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
