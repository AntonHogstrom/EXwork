const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const Photo = require("../models/Photo"); // Album model
const verify = require("../verifyToken"); // Verify token
const { createPhotoValidation } = require("../validation"); // Validering
const Jimp = require("jimp");

//Jimp function
const watermarkImage = async (fileName, image, watermark) => {
  let watermarkImage = await Jimp.read(watermark);
  let jimpImage = await Jimp.read(image);
  jimpImage = jimpImage.quality(60);
  const imageWidth = jimpImage.bitmap.width;
  const imageHeight = jimpImage.bitmap.height;
  watermarkImage = watermarkImage.resize(imageWidth / 2, Jimp.AUTO);
  const x = imageWidth - watermarkImage.bitmap.width * 1.5;
  const y = imageHeight - watermarkImage.bitmap.height * 1.1;

  jimpImage.composite(watermarkImage, x, y, {
    mode: Jimp.BLEND_SOURCE_OVER,
    opacityDest: 1,
    opacitySource: 0.7,
  });
  await jimpImage.writeAsync(
    `${__dirname}/../../photo_proofing_app/public/Images/Watermarked/${fileName}`
  );
};

router.get("/", async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta med id
router.get("/:id", async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//hämta alla med foreign key album
router.get("/album/:id", async (req, res) => {
  try {
    const photo = await Photo.find({ album: req.params.id });
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.post("/", async (req, res) => {
  //Om req.files är satt
  if (req.files) {
    const photosArray = [];
    if (req.files.file.length > 1) {
      //Om flera filer
      for (let i = 0; i < req.files.file.length; i++) {
        const file = req.files.file[i];
        file.mv(
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName[i]}`,
          async (err) => {
            if (err) {
              return res.status(500).json({ Error: err });
            }
          }
        );
        watermarkImage(
          "wm_" + req.body.fileName[i],
          `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName[i]}`,
          `${__dirname}/../../photo_proofing_app/public/Images/watermark.png`
        );

        //Pushar varje bild till array
        const photo = new Photo({
          name: req.body.fileName[i],
          watermarked: req.body.watermarked[i],
          album: req.body.album[i],
          owner: req.body.owner[i],
        });
        photosArray.push(photo);
      }
    } else {
      //Om endast en fil, ingen loop och inget i-värde
      const file = req.files.file;
      file.mv(
        `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
        async (err) => {
          if (err) {
            return res.status(500).json({ Error: err });
          }
        }
      );
      watermarkImage(
        "wm_" + req.body.fileName,
        `${__dirname}/../../photo_proofing_app/public/Images/Photos/${req.body.fileName}`,
        `${__dirname}/../../photo_proofing_app/public/Images/watermark.png`
      );
      const photo = new Photo({
        name: req.body.fileName,
        watermarked: req.body.watermarked,
        album: req.body.album,
        owner: req.body.owner,
      });
      photosArray.push(photo);
    }
    //Tar bild-data och skickar till databasen
    Photo.insertMany(photosArray, (err, photos) => {
      if (err) {
        res.status(500).json({ error: err });
        console.log("Error: ", err);
      } else {
        res.status(200).json(photos);
      }
    });
  } else {
    return res.status(400).json({ Error: "No file" });
  }
});

//Radera alla med id som finns med i medskickad array
router.delete("/many", async (req, res) => {
  try {
    console.log(1, req.body);
    const photos = await Photo.find({ _id: { $in: req.body.ids } });
    photos.forEach((photo) => {
      photo.remove();
    });
    res.json({ Removed: req.body.ids });
    console.log(2, req.body);
  } catch (err) {
    console.log(3, req.body);
    console.log("Error: ", err);
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Raderar en
router.delete("/:id", async (req, res) => {
  try {
    await Photo.where("_id", req.params.id).deleteOne();
    res.json({ Removed: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//radera alla med userID
router.delete("/user/:id", async (req, res) => {
  try {
    await Photo.where("owner", req.params.id).deleteMany();
    res.json({ Removed: "All from User " + req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//radera alla med albumID
router.delete("/album/:id", async (req, res) => {
  try {
    await Photo.where("album", req.params.id).deleteMany();
    res.json({ Removed: "All from Album " + req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

router.patch("/:id", async (req, res) => {
  try {
    //Upload photo
    if (req.files) {
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
    const photo = await Photo.findById(req.params.id);
    req.body.name ? (photo.name = req.body.name) : null;
    req.body.name ? (photo.watermark = "wm_" + req.body.name) : null;
    req.body.album ? (photo.album = req.body.album) : null;
    req.body.customers ? (photo.customers = req.body.customers) : null;
    req.body.owner ? (photo.owner = req.body.owner) : null;
    req.body.invites ? (photo.invites = req.body.invites) : null;
    req.body.photos ? (photo.photos = req.body.photos) : null;
    await photo.save();
    res.json({ Updated: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

module.exports = router;
