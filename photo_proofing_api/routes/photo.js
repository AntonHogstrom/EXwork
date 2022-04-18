const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Photo = require("../models/Photo"); // Photo model
const bcrypt = require("bcryptjs"); // Bcrypt
const jwt = require("jsonwebtoken"); // JSON web token
const verify = require("../verifyToken"); // Verify token

router.get("/", async (req, res) => {
  try {
    const photo = await Photo.find();
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.get("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Hämta alla bilder från album med id
router.get("/album/:id", async (req, res) => {
  try {
    const photo = await Photo.find({ album: req.params.id });
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.post("/", async (req, res) => {
  const photo = new Photo({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags,
    albums: req.body.albums,
  });
  try {
    const newPhoto = await photo.save();
    res.json({ Created: newPhoto._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    photo.name = req.body.name;
    photo.description = req.body.description;
    photo.tags = req.body.tags;
    photo.albums = req.body.albums;
    const updatedPhoto = await photo.save();
    res.json({ Updated: updatedPhoto._id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    await photo.remove();
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
