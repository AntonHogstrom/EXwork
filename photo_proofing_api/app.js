const express = require("express"); // Express web server framework
const mongoose = require("mongoose"); // MongoDB integration
const cors = require("cors"); // CORS integration
const fileUpload = require("express-fileupload"); // File upload integration
const userRoutes = require("./routes/user");
const albumRoutes = require("./routes/album");
const photoRoutes = require("./routes/photo");

require("dotenv").config(); // Ladda .env filen

const app = express(); // Skapar en express applikation

//Middlewares
app.use(express.json()); // Parsar inkommande förfrågningar med JSON
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Tillåter alla domäner att anropa API:et
app.use(fileUpload()); // Tillåter filuppladdning

//Route middleware
app.use("/api/user", userRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/photo", photoRoutes);

//Anslutning till databasen
mongoose.connect(process.env.DB_URI, () => {
  console.log("Connected to database!");
});

const port = process.env.PORT || 8000;

//Lyssna mot port
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
