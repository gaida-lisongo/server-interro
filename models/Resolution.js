const mongoose = require("mongoose");

const ResolutionSchema = new mongoose.Schema({
    etudiantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Etudiant"
    },
    reponses: [
        {
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Question"
            },
            pts: Number
        }
    ],
    serieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Serie"
    }
})

module.exports = mongoose.model("Resolution", ResolutionSchema);
