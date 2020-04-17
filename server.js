const express = require("express");
const path = require("path");
const fs = require("fs");
const notesDB = require("./db/db.json");
const { v4: uuidv4 } = require("uuid");
const util = require("util")
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// GET ROUTE FOR /NOTES TO RETURN NOTES.HTML
app.get("/notes", function (req, res) {
  // console.log(notesDB);
  // console.log(JSON.stringify(notesDB));
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// `db.json` file on the backend that will be used to store and retrieve notes using the `fs` module
// GET `/api/notes` - Should read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
  res.json(notesDB);
});
// Assign id to notes
app.get("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedNotes[Number(req.params.id)]);
});

// POST `/api/notes` - Should receive a new note to save on the request body, add it to the `db.json` file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
  req.body.id = uuidv4();
  notesDB.push(req.body);
  //   write JSON file with new post
  fs.writeFile("./db/db.json", JSON.stringify(notesDB), function () {
    // console.log("Yay!");
  });
  res.json(true);
});

// DELETE `/api/notes/:id` -
// Should receive a query parameter containing the id of a note to delete.
// This means you'll need to find a way to give each note a unique `id` when it's saved.
// In order to delete a note, you'll need to read all notes from the `db.json` file,
// remove the note with the given `id` property, and then
// rewrite the notes to the `db.json` file.

app.delete("/api/notes/:id", function (req, res) {
  let notesDB = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  console.log(noteID);
  // console.log(`Delete note ID: ${noteID}`);
  newNotesDB = notesDB.filter((currentNote) => {
    return currentNote.id != noteID;
  });

  writeFileAsync("./db/db.json", JSON.stringify(newNotesDB))
  .then(() => res.json(newNotesDB));
});

// GET * - Should return the `index.html` file
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
