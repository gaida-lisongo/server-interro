const mongoose = require("mongoose");

const CoursSchema = new mongoose.Schema({
    designation: String,
    unite: String,
    credit: Number,
    enseignant: String,
    semestre: String,
    annee: String
})

module.exports = mongoose.model("Cours", CoursSchema);
