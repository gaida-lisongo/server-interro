const mongoose = require("mongoose");

const EtudiantSchema = new mongoose.Schema({
    nom: String,
    post_nom: String,
    prenom: String,
    matricule: String
})

module.exports = mongoose.model("Etudiant", EtudiantSchema);
