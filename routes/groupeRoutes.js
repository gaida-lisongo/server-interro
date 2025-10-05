const express = require("express");
const router = express.Router();
const Groupe = require("../models/Groupe");
const Cours = require("../models/Cours");
const secure = require("../utils/Secure");

//Middleware
const userAuth = (req, res, next) => {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).send("Authorization header missing");
        }
        
        // Check if authorization header has the correct format (Bearer token)
        const authParts = req.headers.authorization.split(" ");
        if (authParts.length !== 2 || authParts[0] !== "Bearer") {
            return res.status(401).send("Invalid authorization format. Use: Bearer <token>");
        }
        
        const token = authParts[1];
        const user = secure.verifyToken(token);
        if (!user) {
            return res.status(401).send("Invalid or expired token");
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).send("Authentication failed");
    }
}

//Create a new groupe
router.post("/", async (req, res) => {
    const groupe = new Groupe(req.body);
    try {
        await groupe.save();
        res.status(201).send(groupe);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all groupes by user
router.get("/serie/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const groupes = await Groupe.find({ serieId: req.params.id }).populate("etudiantIds").populate("serieId").populate("userId").lean();
        if (!groupes) {
            return res.status(404).send("Groupes not found");
        }
        res.status(200).send(groupes);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all groupes
router.get("/all", userAuth, async (req, res) => {
    try {
        const groupes = await Groupe.find().populate("serieId").populate("etudiantIds").populate("userId").lean();
        if (!groupes) {
            return res.status(404).send("Groupes not found");
        }
        
        let groupesData = [];
        let coursData = [];
        await Promise.all(groupes.map(async (groupe) => {
            if (groupe.userId.toString() === req.user.id) {
                groupesData.push(groupe);
            }

            const serie = groupe.serieId;
            const cours = await Cours.findById(serie.coursId);

            if (cours) {
                const isExist = coursData.find((c) => c._id.toString() === cours._id.toString());
                if (!isExist) {
                    coursData.push(cours);
                }
            }
        }));
        res.status(200).send({groupes: groupesData, cours: coursData});
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get detail groupe
router.get("/:id", async (req, res) => {
    try {
        const groupe = await Groupe.findById(req.params.id).populate("serieId").populate("userId").lean();
        if (!groupe) {
            return res.status(404).send("Groupe not found");
        }

        if(groupe.statut == "NO") {
            return res.status(404).send("Groupe not found");
        }

        let questionsData = [];
        const cours = await Cours.findById(groupe.serieId.coursId);
        const serie = groupe.serieId;
        serie.questions.forEach((question) => {
            questionsData.push({
                _id: question._id,
                enonce: question.enonce,
                assertions: question.assertions,
                pts: question.pts
            });
        });
        
        const groupeFormated = {
            _id: groupe._id,
            designation: groupe.designation,
            statut: groupe.statut,
            cours: cours,
            questions: questionsData,
            titulaire: groupe.userId,
            serieId: groupe.serieId._id            
        }
        res.status(200).send(groupeFormated);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update a groupe
router.put("/:id", async (req, res) => {
    try {
        const groupe = await Groupe.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(groupe);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a groupe
router.delete("/:id", async (req, res) => {
    try {
        const groupe = await Groupe.findByIdAndDelete(req.params.id);
        res.status(200).send(groupe);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;