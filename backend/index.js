require("dotenv").config();

const mongoose = require("mongoose");
const config = require("./config.json");
mongoose.connect(config.connectionString);

const User = require("./models/user");
const Note = require("./models/note");

const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "Hello World" });
});

app.post("/create-account", async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: true, message: "Request body is required." });
    }
    const { fullName, email, password } = req.body;
    if (!fullName) {
      return res
        .status(400)
        .json({ error: true, message: "Full name is required." });
    }
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required." });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "A user with this email already exists.",
      });
    }
    const newUser = new User({ fullName, email, password });
    await newUser.save();
    const accessToken = jwt.sign(
      { user: newUser },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "36000m" }
    );
    res.status(201).json({
      error: false,
      newUser,
      message: "Registration successful.",
      accessToken,
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error during registration.",
      details: err.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: true, message: "Request body is required." });
    }
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ error: true, message: "Email is required." });
    }
    if (!password) {
      return res
        .status(400)
        .json({ error: true, message: "Password is required." });
    }
    const returnedUser = await User.findOne({ email: email });
    if (!returnedUser) {
      return res
        .status(404)
        .json({ error: true, message: "No user found with this email." });
    }
    if (returnedUser.email === email && returnedUser.password === password) {
      const accessToken = jwt.sign(
        { user: returnedUser },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "36000m" }
      );
      res.json({
        error: false,
        email,
        message: "Login successful.",
        accessToken,
      });
    } else {
      return res.status(401).json({
        error: true,
        message: "Invalid credentials. Please check your email and password.",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error during login.",
      details: err.message,
    });
  }
});

app.get("/get-user", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
      return res
        .status(401)
        .json({ error: true, message: "User not found or unauthorized." });
    }
    return res.json({
      user: {
        fullName: isUser.fullName,
        email: isUser.email,
        _id: isUser._id,
        createdOn: isUser.createdOn,
      },
      message: "User info retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error fetching user info.",
      details: err.message,
    });
  }
});

app.post("/add-note", authenticateToken, async (req, res) => {
  try {
    if (!req.body) {
      return res
        .status(400)
        .json({ error: true, message: "Request body is required." });
    }
    const { title, content, tags } = req.body;
    const { user } = req.user;
    if (!title) {
      return res
        .status(400)
        .json({ error: true, message: "Title is required." });
    }
    if (!content) {
      return res
        .status(400)
        .json({ error: true, message: "Content is required." });
    }
    const newNote = new Note({
      title,
      content,
      tags: tags || [],
      userId: user._id,
    });
    await newNote.save();
    res
      .status(201)
      .json({ error: false, newNote, message: "Note added successfully." });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error adding note.",
      details: err.message,
    });
  }
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;
    if (!title && !content && !tags) {
      return res
        .status(400)
        .json({ error: true, message: "No changes provided." });
    }
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }
    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error updating note.",
      details: err.message,
    });
  }
});

app.get("/get-all-notes/", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;
    const notes = await Note.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      notes,
      message: "All notes retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error fetching notes.",
      details: err.message,
    });
  }
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { user } = req.user;
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }
    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Note deleted successfully." });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error deleting note.",
      details: err.message,
    });
  }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  try {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found." });
    }
    note.isPinned = isPinned || false;
    await note.save();
    return res.json({
      error: false,
      note,
      message: "Note pin status updated successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error updating pin status.",
      details: err.message,
    });
  }
});

app.get("/search-note", authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    const { user } = req.user;
    if (!query) {
      return res
        .status(400)
        .json({ error: true, message: "Query is required." });
    }
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });
    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Search results retrieved successfully.",
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Server error searching notes.",
      details: err.message,
    });
  }
});

app.listen(8000);

module.exports = app;
