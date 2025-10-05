const express = require("express");
const router = express.Router();
const Resolution = require("../models/Resolution");

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

//Get all resolutions
router.get("/", async (req, res) => {
    try {
        const resolutions = await Resolution.find();
        res.status(200).send(resolutions);
    } catch (error) {
        res.status(400).send(error);
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