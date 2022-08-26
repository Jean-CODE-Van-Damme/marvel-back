const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/User");
// const isAuthentificated = require("../middleware/isAuthentificated");

//Route pour retourner Comics
router.get("/comics", async (req, res) => {
  try {
    const { page = 1, limit = 100, title } = req.query;

    let skip = limit * page - limit;

    // Requete vers l'API Marvel
    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/comics?apiKey=${
        process.env.MARVEL_API_KEY
      }&skip=${skip}&limit=${limit}&title=${title ? title : ""}`
    );

    const numberOfPages = Math.ceil(response.data.count / limit);

    const arrayComicsData = response.data.results;
    let arrayComics = [];
    let objAnswer = {};

    // Boucle sur le Array de Comics recu en data
    for (let i = 0; i < arrayComicsData.length; i++) {
      let objectComics = {};

      let comicsTitle = arrayComicsData[i].title;
      let comicsDescription = arrayComicsData[i].description;
      let comicsPictureUrl =
        arrayComicsData[i].thumbnail.path +
        "." +
        arrayComicsData[i].thumbnail.extension;
      let comicsId = arrayComicsData[i]._id;

      // Création des clefs de l'objet
      if (comicsTitle) {
        objectComics.title = comicsTitle;
      }

      if (comicsId) {
        objectComics.comics_id = comicsId;
      }

      if (comicsDescription) {
        objectComics.description = comicsDescription;
      }

      if (comicsPictureUrl) {
        objectComics.picture = comicsPictureUrl;
      }

      // Push de l'objet dans le arrayComics
      arrayComics.push(objectComics);
    }

    objAnswer.numberOfPages = numberOfPages;
    objAnswer.comics = arrayComics;

    // Reponse vers le Front
    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Route pour retourner Comics contenant un personnage
router.get("/comics/:characterId", async (req, res) => {
  const { characterId } = req.params;
  try {
    // console.log("route/comicsperso:id ");
    // il faudra recuperer l id du front passe en parametre params

    // Requete API Marvel
    const response = await axios.get(
      `${process.env.API_MARVEL_URL}/comics/${characterId}?apiKey=${process.env.MARVEL_API_KEY}`
    );
    // console.log("response ", response.data);

    const arrayComicsWithCharacterData = response.data.comics;
    let arrayComicsWithCharacter = [];
    let objAnswer = {};

    // Boucle le Array recu en data
    for (let i = 0; i < arrayComicsWithCharacterData.length; i++) {
      let objectComicsWithCharacter = {};
      let comicsWithCharacterTitle = response.data.comics[i].title;
      let comicsWithCharacterDescription = response.data.comics[i].description;
      let comicsWithCharacterPicture =
        response.data.comics[i].thumbnail.path +
        "." +
        response.data.comics[i].thumbnail.extension;
      let comicsWithCharacterId = response.data.comics[i]._id;

      // Creation des clefs de l'objet
      if (comicsWithCharacterTitle) {
        objectComicsWithCharacter.title = comicsWithCharacterTitle;
      }

      if (comicsWithCharacterDescription) {
        objectComicsWithCharacter.descritpion = comicsWithCharacterDescription;
      }

      if (comicsWithCharacterPicture) {
        objectComicsWithCharacter.picture = comicsWithCharacterPicture;
      }

      if (comicsWithCharacterId) {
        objectComicsWithCharacter._id = comicsWithCharacterId;
      }

      // on push les objets dans le arrayComicsWithCharacter
      arrayComicsWithCharacter.push(objectComicsWithCharacter);
    }

    // Recuperation de la picture du perso principal
    comicsPrincipalPicture =
      response.data.thumbnail.path + "." + response.data.thumbnail.extension;
    let objectComicsPrincipalPicture = {
      character_picture: comicsPrincipalPicture,
    };

    // Creation des clefs de l objet avec la picture du perso principal et le array des comics liés
    objAnswer.principalCharacterPicture = comicsPrincipalPicture;
    objAnswer.arrayOfComics = arrayComicsWithCharacter;

    // Reponse vers le Front
    res.status(200).json(objAnswer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
