const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Album = require("../models/Album"); // Album model
const bcrypt = require("bcryptjs"); // Bcrypt
const jwt = require("jsonwebtoken"); // JSON web token
const verify = require("../verifyToken"); // Verify token
const { createAlbumValidation } = require("../validation"); // Validering

router.get("/", async (req, res) => {
  try {
    const albums = await Album.find();
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta med id
router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta alla med foreign key owner
router.get("/user/:id", async (req, res) => {
  try {
    const albums = await Album.find({ owner: req.params.id });
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.post("/", async (req, res) => {
  //Upload Image
  if (req.files) {
    const file = req.files.file;
    file.mv(
      `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${req.body.cover}`,
      async (err) => {
        if (err) {
          return res.status(500).json({ Error: err });
        }
      }
    );
  }

  const { error } = createAlbumValidation(req.body);
  if (error) return res.status(400).json(error.details[0].message); //Om något går fel

  const album = new Album({
    name: req.body.name,
    description: req.body.description,
    tags: req.body.tags.replace(/\s/g, "").split(","), //Tar bort whitespace och splittar på kommatecken
    cover: req.body.cover,
    owner: req.body.owner,
  });
  try {
    console.log(album);
    const newAlbum = await album.save();
    res.status(200).json({ Created: newAlbum._id });
  } catch (err) {
    console.log("Error: ", err);
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    await album.remove();
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    album.name = req.body.name;
    album.description = req.body.description;
    album.tags = req.body.tags;
    album.cover = req.body.cover;
    album.owner = req.body.owner;
    album.invites = req.body.invites;
    album.photos = req.body.photos;
    await album.save();
    res.json({ Updated: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
