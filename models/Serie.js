const mongoose = require("mongoose");

const SerieSchema = new mongoose.Schema({
    coursId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cours"
    },
    questions: [
        {
            enonce: String,
            reponse: String,
            assertions: [String],
            pts: Number
        }
    ],
    statut: {type: String, enum: ["ON", "PENDING", "OK"], default: "PENDING"}
    
});

module.exports = mongoose.model("Serie", SerieSchema);
