const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URI);

const app = express();
app.use(formidable());
app.use(cors());

const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

const comics = require("./routes/comics");
app.use(comics);

const user = require("./routes/user");
app.use(user);

app.all("*", (req, res) => {
  res.status(400).json({ message: "This route doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("serveur Marvel is started");
});
