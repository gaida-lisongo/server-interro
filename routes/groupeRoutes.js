const express = require("express");
const router = express.Router();
const Groupe = require("../models/Groupe");

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

//Get all groupes
router.get("/", async (req, res) => {
    try {
        const groupes = await Groupe.find();
        res.status(200).send(groupes);
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