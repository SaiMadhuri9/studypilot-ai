const Note = require("../models/Note");

const getNotes = async (req, res) => {

  const notes =
    await Note.find();

  res.json({
    success: true,
    data: notes
  });

};

const createNote = async (req, res) => {

  const note =
    await Note.create({
      title: req.body.title,
      content: req.body.content
    });

  res.json({
    success: true,
    data: note
  });

};

const deleteNote = async (req, res) => {

  await Note.findByIdAndDelete(
    req.params.id
  );

  res.json({
    success: true
  });

};

module.exports = {
  getNotes,
  createNote,
  deleteNote
};