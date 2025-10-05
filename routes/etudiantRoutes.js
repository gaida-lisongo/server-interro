const express = require("express");
const router = express.Router();
const Etudiant = require("../models/Etudiant");

//Create a new etudiant
router.post("/", async (req, res) => {
    const etudiant = new Etudiant(req.body);
    try {
        await etudiant.save();
        res.status(201).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all etudiants
router.get("/", async (req, res) => {
    try {
        const etudiants = await Etudiant.find();
        res.status(200).send(etudiants);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get detail etudiant
router.get("/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findById(req.params.id);
        if (!etudiant) {
            return res.status(404).send("Etudiant not found");
        }
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update a etudiant
router.put("/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a etudiant
router.delete("/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findByIdAndDelete(req.params.id);
        res.status(200).send(etudiant);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;