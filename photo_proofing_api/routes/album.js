const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Album = require("../models/Album"); // Album model
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
    tags: req.body.tags,
    cover: req.body.cover,
    owner: req.body.owner,
  });

  try {
    const newAlbum = await album.save();
    res.status(200).json({ Created: newAlbum._id });
  } catch (err) {
    console.log("Error: ", err);
    res.status(400).json({ error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Album.deleteOne({
      _id: req.params.id,
    });
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.patch("/:id", async (req, res) => {
  try {
    if (req.files) {
      //Upload Album Cover
      if (req.body.cover) {
        const file = req.files.file;
        file.mv(
          `${__dirname}/../../photo_proofing_app/public/Images/AlbumCovers/${req.body.cover}`,
          async (err) => {
            if (err) {
              return res.status(500).json({ Error: err });
            }
          }
        );
      } else {
        //if not array
        const file = req.files.file;
        file.mv(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
          async (err) => {
            if (err) {
              return res.status(500).json({ Error: err });
            }
          }
        );
      }
    }
    const album = await Album.findById(req.params.id);
    req.body.name ? (album.name = req.body.name) : null;
    req.body.description ? (album.description = req.body.description) : null;
    req.body.tags ? (album.tags = req.body.tags) : null;
    req.body.cover ? (album.cover = req.body.cover) : null;
    req.body.owner ? (album.owner = req.body.owner) : null;
    req.body.invites ? (album.invites = req.body.invites) : null;
    req.body.photos ? (album.photos = req.body.photos) : null;
    await album.save();
    res.json({ Updated: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
