const express = require("express");
const router = express.Router();
const Serie = require("../models/Serie");

//Create a new serie
router.post("/", async (req, res) => {
    const serie = new Serie(req.body);
    try {
        await serie.save();
        res.status(201).send(serie);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all series
router.get("/", async (req, res) => {
    try {
        const series = await Serie.find();
        res.status(200).send(series);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update a serie
router.put("/:id", async (req, res) => {
    try {
        const serie = await Serie.findByIdAndUpdate(req.params.id, req.body);
        res.status(200).send(serie);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Delete a serie
router.delete("/:id", async (req, res) => {
    try {
        const serie = await Serie.findByIdAndDelete(req.params.id);
        res.status(200).send(serie);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
