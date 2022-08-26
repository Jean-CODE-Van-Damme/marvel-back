const mongoose = require("mongoose");

//Creation d un model User pour l'authentification
const User = mongoose.model("User", {
  email: { type: String },
  username: { type: String },
  token: String,
  hash: String,
  salt: String,
  favoritesComicsId: [],
  favoritesCharacterId: [],
});

module.exports = User;
