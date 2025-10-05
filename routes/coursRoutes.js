const express = require("express");
const router = express.Router();
const Cours = require("../models/Cours");

//Create a new cours
router.post("/", async (req, res) => {
    const cours = new Cours(req.body);
    try {
        await cours.save();
        res.status(201).send(cours);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all cours
router.get("/", async (req, res) => {
    try {
        const cours = await Cours.find();
        res.status(200).send(cours);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update a cours
router.put("/:id", async (req, res) => {
    try {
        const cours = await Cours.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(cours);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a cours
router.delete("/:id", async (req, res) => {
    try {
        const cours = await Cours.findByIdAndDelete(req.params.id);
        res.status(200).send(cours);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;