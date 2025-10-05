const express = require("express");
const router = express.Router();
const Groupe = require("../models/Groupe");
const Cours = require("../models/Cours");
const secure = require("../utils/Secure");

//Middleware
const userAuth = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    const user = secure.verifyToken(token);
    if (!user) {
        return res.status(401).send("Unauthorized");
    }
    req.user = user;
    next();
}

//Create a new groupe
router.post("/", userAuth, async (req, res) => {
    const groupe = new Groupe(req.body);
    try {
        await groupe.save();
        res.status(201).send(groupe);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all groupes
router.get("/", userAuth, async (req, res) => {
    try {
        const groupes = await Groupe.find().populate("serieId").lean();
        if (!groupes) {
            return res.status(404).send("Groupes not found");
        }
        
        let groupesData = [];
        let coursData = [];
        Promise.all(groupes.map(async (groupe) => {
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