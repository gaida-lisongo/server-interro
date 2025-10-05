const mongoose = require("mongoose");

const GroupeSchema = new mongoose.Schema({
    serieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Serie"
    },
    etudiantIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Etudiant"
        }
    ]
});

module.exports = mongoose.model("Groupe", GroupeSchema);
