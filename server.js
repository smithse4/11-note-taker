const express = require("express");
const path = require("path");
const fs = require("fs");
const notesDB = require("./db/db.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// GET ROUTE FOR /NOTES TO RETURN NOTES.HTML
app.get("/notes", function(req, res) {
  console.log(notesDB);
  console.log(JSON.stringify(notesDB));
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module
// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function(req, res) {
  res.json(notesDB);
});
// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function(req, res) {
  console.log(req.body);

  notesDB.push(req.body);
  //   append JSON file with new post
  fs.writeFile("./db/db.json", JSON.stringify(notesDB), function() {
    console.log("Yay!");
  });
  res.json(true);
});

// DELETE `/api/notes/:id` -
// Should receive a query parameter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique `id` when it's saved.
// In order to delete a note, you'll need to read all notes from the `db.json` file,
// remove the note with the given `id` property, and then
// rewrite the notes to the `db.json` file.

// GET * - Should return the `index.html` file
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
