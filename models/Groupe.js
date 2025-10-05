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
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    designation: String,
    statut: {type: String, enum: ["ON", "PENDING", "OK"], default: "PENDING"}
});

module.exports = mongoose.model("Groupe", GroupeSchema);
