const express = require('express');
const fs = require('fs');
const app = express();
const port = 8000;
const filePath = 'D:\\University\\Web\\bc2023-5\\notes.json';

app.use(express.json());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get('/UploadForm.html', (req, res) => {
  const path = `D:\\University\\Web\\bc2023-5\\UploadForm.html`;
  console.log(path);
  res.sendFile(path);
});

let notes = {};

try {
  notes = JSON.parse(fs.readFileSync(filePath));
} catch (err) {
  console.error(err);
}

app.post('/upload', (req, res) => {
  const noteName = req.body.note_name;
  const note = req.body.note;

  console.log("Received data:", req.body);

  if (!noteName || !note) {
    return res.status(400).end();
  }

  if (notes[noteName]) {
    return res.status(400).end();
  }

  notes[noteName] = note;

  try {
    fs.writeFileSync(filePath, JSON.stringify(notes));
    console.log('Notes successfully saved to file.');
  } catch (err) {
    console.error('Could not save file', err);
    return res.status(500).end();
  }

  console.log(`Saved note: ${noteName}`);

  res.status(201).end();
});

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.get('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;

  if (!notes[noteName]) {
    return res.status(404).end();
  }

  const note = {
    note_name: noteName,
    note: notes[noteName]
  };

  res.json(note);
});

app.put('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;
  const updatedNote = req.body.note;

  if (!notes[noteName]) {
    return res.status(404).end();
  }

  notes[noteName] = updatedNote;

  try {
    fs.writeFileSync(filePath, JSON.stringify(notes));
    console.log('Notes successfully updated and saved to file.');
  } catch (err) {
    console.error('Could not save file', err);
    return res.status(500).end();
  }

  res.status(200).end();
});

app.delete('/notes/:noteName', (req, res) => {
  const noteName = req.params.noteName;

  if (!notes[noteName]) {
    return res.status(404).end();
  }

  delete notes[noteName];

  try {
    fs.writeFileSync(filePath, JSON.stringify(notes));
    console.log('Note successfully deleted and saved to file.');
  } catch (err) {
    console.error('Could not save file', err);
    return res.status(500).end();
  }

  res.status(204).end();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
