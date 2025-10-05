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
        const series = await Serie.find().populate("coursId");
        res.status(200).send(series);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Get all series by cours
router.get("/cours/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const series = await Serie.find({ coursId: req.params.id }).populate("coursId");
        console.log("series :", series);
        res.status(200).send(series);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Update a serie
router.put("/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        console.log("Updating serie :", req.body);
        
        // Clean up questions data - remove empty _id fields
        if (req.body.questions) {
            req.body.questions = req.body.questions.map(question => {
                // If _id is empty string or null, remove it to let Mongoose generate a new one
                if (question._id === '' || question._id === null || question._id === undefined) {
                    const { _id, ...questionWithoutId } = question;
                    return questionWithoutId;
                }
                return question;
            });
        }
        
        const serie = await Serie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        console.log("serie updated :", serie);
        res.status(200).send(serie);
    } catch (error) {
        console.log(error);
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
