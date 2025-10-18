const express = require("express");
const router = express.Router();
const Resolution = require("../models/Resolution");
const Serie = require("../models/Serie");

//Create a new resolution
router.post("/", async (req, res) => {
    const resolution = new Resolution(req.body);
    try {
        await resolution.save();
        res.status(201).send(resolution);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Submit and correct student responses
router.post("/submit", async (req, res) => {
    try {
        const { etudiantId, reponses, serieId } = req.body;
        
        // Vérifier si la série existe
        const serie = await Serie.findById(serieId);
        if (!serie) {
            return res.status(404).json({ error: "Serie not found" });
        }

        let totalPoints = 0;
        let maxPoints = 0;
        const reponseData = [];

        // Parcourir chaque question de la série
        serie.questions.forEach((question, index) => {
            const questionId = question._id;
            const questionPoints = question.pts || 1;
            const correctAnswer = question.reponse;
            
            maxPoints += questionPoints;

            // Vérifier si l'étudiant a répondu à cette question
            const studentAnswer = reponses[questionId] || reponses[index];
            
            let pointsObtained = 0;
            if (studentAnswer && studentAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
                pointsObtained = questionPoints;
                totalPoints += pointsObtained;
            }

            reponseData.push({
                questionId: questionId,
                pts: pointsObtained
            });
        });

        // Créer l'objet Resolution selon le schema
        const resolution = new Resolution({
            etudiantId: etudiantId,
            reponses: reponseData,
            serieId: serieId
        });

        // Sauvegarder la résolution
        await resolution.save();

        // Retourner la note obtenue
        res.status(201).json({
            resolution: resolution,
            noteObtenue: totalPoints,
            noteMaximale: maxPoints,
            pourcentage: Math.round((totalPoints / maxPoints) * 100)
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get all resolutions
router.get("/", async (req, res) => {
    try {
        const resolutions = await Resolution.find();
        res.status(200).send(resolutions);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/etudiant/:id', async (req, res) => {
    try {
        const resolutions = await Resolution.find({ etudiantId: req.params.id });
        res.status(200).send({
            status: "success",
            message: "Resolutions found",
            data: resolutions
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message
        });
    }
});

//Get resolution by etudiantId and serieId
router.get('/serie/:serieId', async (req, res) => {
    try {
        const resolution = await Resolution.find({ serieId: req.params.serieId }).populate("etudiantId").populate("serieId").lean();
        console.log("Data resoluton : ", resolution);

        res.status(200).send({
            status: "success",
            message: "Resolutions found",
            data:[...resolution],
        });
    } catch (error) {
        res.status(400).send({
            status: "error",
            message: error.message
        });
    }
});

//Update a resolution
router.put("/:id", async (req, res) => {
    try {
        const resolution = await Resolution.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(resolution);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a resolution
router.delete("/:id", async (req, res) => {
    try {
        const resolution = await Resolution.findByIdAndDelete(req.params.id);
        res.status(200).send(resolution);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;