const mongoose = require("mongoose");

const CoursSchema = new mongoose.Schema({
    designation: String,
    unite: String,
    credit: Number,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    semestre: String,
    annee: String
})

module.exports = mongoose.model("Cours", CoursSchema);
