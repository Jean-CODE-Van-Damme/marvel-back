const express = require("express");
const router = express.Router();
const User = require("../models/User");
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

// Route pour s'inscire
router.post("/user/signup", async (req, res) => {
  try {
    const { username, email, password } = req.fields;
    const userSameMail = await User.findOne({ email: email });

    if (!userSameMail) {
      // Creation salt, hash, token
      const salt = uid2(16);
      const hash = SHA256(salt + password).toString(encBase64);
      const token = uid2(64);

      // Creation d un nouveau user en BDD sur le model User
      const newUser = await new User({
        email: email,
        username: username,
        token: token,
        hash: hash,
        salt: salt,
      });

      // Reponse au Front
      res.status(200).json({
        token: token,
        username: username,
      });
      await newUser.save();
    } else {
      res.status(400).json({ message: "This Email Already Exist" });
    }

    // Sauvegarde du nouveau user en BDD
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour se connecter
router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;

    // Recherche d un user avec le meme email en BDD
    const userToFind = await User.findOne({ email: email });
    if (userToFind) {
      // Creation d un nouveau hash avec son salt et son password perso
      const newHash = SHA256(userToFind.salt + password).toString(encBase64);
      const hash = userToFind.hash;
      // Verification des deux hash pour confirmer l'identite
      if (hash === newHash) {
        // Reponse au Front si ok
        res.status(200).json({
          token: userToFind.token,
          username: userToFind.username,
        });
      } else {
        res.status(401).json({ message: " Unauthorized" });
      }
    } else {
      res.status(401).json({ message: " Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route pour envoyer les id de favoris character au model User si ils n existent pas deja,
// Sinon les supprimer

router.post("/user/favorite/character/:characterId", async (req, res) => {
  try {
    // recup  id du charactere favoris et token de l utilisateur connecte
    const { characterId } = req.params;
    const { tokenCookie, name, description, picture } = req.fields;

    // on recherche un utilisateur avec le meme token
    const userToFind = await User.findOne({ token: tokenCookie });

    let objectFavoriteCharacter = {};
    if (name) {
      objectFavoriteCharacter.name = name;
    }
    if (picture) {
      objectFavoriteCharacter.picture = picture;
    }
    if (description) {
      objectFavoriteCharacter.description = description;
    }

    objectFavoriteCharacter.id = characterId;

    let isHere = false;
    for (let i = 0; i < userToFind.favoritesCharacterId.length; i++) {
      if (
        objectFavoriteCharacter.id === userToFind.favoritesCharacterId[i].id
      ) {
        isHere = true;
        userToFind.favoritesCharacterId.splice(i, 1);
      }
    }

    if (isHere === false) {
      userToFind.favoritesCharacterId.push(objectFavoriteCharacter);
    }

    console.log("User >>>", userToFind);

    await userToFind.save();
    console.log("tab >>>", userToFind.favoritesCharacterId);

    res.status(200).json(userToFind.favoritesCharacterId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/user/favorite/comic/:comicId", async (req, res) => {
  try {
    // recup  id du comic favoris et token de l utilisateur connecte
    const { comicId } = req.params;
    const { tokenCookie, title, description, picture } = req.fields;

    // on recherche un utilisateur avec le meme token
    const userToFind = await User.findOne({ token: tokenCookie });

    let objectFavoriteComic = {};
    if (title) {
      objectFavoriteComic.title = title;
    }
    if (picture) {
      objectFavoriteComic.picture = picture;
    }
    if (description) {
      objectFavoriteComic.description = description;
    }

    objectFavoriteComic.id = comicId;

    let isHere = false;
    for (let i = 0; i < userToFind.favoritesComicsId.length; i++) {
      if (objectFavoriteComic.id === userToFind.favoritesComicsId[i].id) {
        isHere = true;
        userToFind.favoritesComicsId.splice(i, 1);
      }
    }

    if (isHere === false) {
      userToFind.favoritesComicsId.push(objectFavoriteComic);
    }

    console.log("User >>>", userToFind);

    await userToFind.save();

    res.status(200).json(userToFind.favoritesComicsId);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
