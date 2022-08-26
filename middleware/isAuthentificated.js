// Creation d un middleware isAuthentificated pour le passer ne parametre de nos routes
// Afin de verifier si l utilisateur a un token avant de pouvoir aller plus loin dans les routes.
const User = require("../models/User");

const isAuthentificated = async (req, res, next) => {
  console.log("YOYO", req.headers);
  if (req.headers.authorization) {
    // Creation d un token avec BearerToken recu du Front
    const tokenPost = req.headers.authorization.replace("Bearer ", "");
    console.log(tokenPost, "tamere", req.headers.authorization);
    // Recherche d'un user avec le meme Token en BDD
    const userWithToken = await User.findOne({ token: tokenPost });

    if (userWithToken) {
      //   req.userWithToken = userWithToken;
      // on pourra retrouver ce user en cas de besoin avec la clef " req.userWithToken" que l on vient de rajouter
      // a l objet req
      req.User = userWithToken;
      // Si ok, on peut passer a la suite de les routes avec en parametre IsAuthentificated
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthentificated;
