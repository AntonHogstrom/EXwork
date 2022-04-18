const express = require("express"); // Express web server framework
const router = express.Router(); // Router för express
const User = require("../models/User"); // User model
const { registerValidation, loginValidation } = require("../validation"); // Validering
const bcrypt = require("bcryptjs"); // Bcrypt
const jwt = require("jsonwebtoken"); // JSON web token

const verify = require("../verifyToken"); // Verify token

// Hämtar alla användare
router.get("/", verify, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

//Hämtar en specifik användare
router.get("/:id", verify, async (req, res) => {
  //
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message }); // Om något går fel
  }
});

// Skapar en ny användare
router.post("/register", async (req, res) => {
  //validera post-anropet
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message }); //Om något går fel

  //Kontrollera att email inte redan finns i databasen
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(200).json({ error: "Email already exists" });

  //Hasha lösenordet
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //användare objekt från body-data, spara i databasen
  const user = new User({
    name: {
      first: req.body.name.first,
      last: req.body.name.last,
    },
    company: req.body.company,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });
  console.log(user);
  try {
    const newUser = await user.save();
    res.json({ Created: newUser._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//Raderar en användare
router.delete("/:id", verify, async (req, res) => {
  try {
    const removedUser = await User.deleteOne({
      _id: req.params.id,
    });
    res.status(200).json(removedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Uppdaterar en användare
router.patch("/:id", verify, async (req, res) => {
  try {
    //Upload Image
    if (req.files) {
      const file = req.files.file;
      const fileName = `${Date.now()}_${file.name}`;

      file.mv(
        `${__dirname}/../../photo_proofing_app/public/Images/ProfileImages/${fileName}`,
        (req.body.profilePicture = fileName),
        async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ Error: err });
          }
        }
      );
    }

    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: {
            first: req.body.first,
            last: req.body.last,
          },
          company: req.body.company,
          bio: req.body.bio,
          profilePicture: req.body.profilePicture,
        },
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Login
router.post("/login", async (req, res) => {
  //validera post-anropet
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  //Kontrollera att email finns i databasen
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ error: "Email or password is incorrect" });

  //Kontrollera lösenordet
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).json({ error: "Email or password is incorrect" });

  //Skapa token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    noTimestamp: true,
    expiresIn: "1h",
  });
  res.header("auth-token", token).json({ token: token, _id: user._id });
});
module.exports = router;
