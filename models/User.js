const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nom: String,
    post_nom: String,
    prenom: String,
    sexe: String,
    grade: String,
    password: String,
    email: String,
    role: String
});

module.exports = mongoose.model("User", UserSchema);
