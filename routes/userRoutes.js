const express = require("express");
const router = express.Router();
const User = require("../models/User");
const secure = require("../utils/Secure");

//Signup user
router.post("/signup", async (req, res) => {
    console.log(req.body);
    const {nom, post_nom, prenom, sexe, grade, password, email, role } = req.body;
    if (!nom || !post_nom || !prenom || !sexe || !grade || !password || !email || !role) {
        return res.status(400).send("Missing required fields");
    }

    const hashPassword = secure.hashPassword(password);
    const user = new User({nom, post_nom, prenom, sexe, grade, password: hashPassword, email, role });
    console.log("user", user);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

//Login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
        return res.status(400).send("User not found");
    }
    if (user.password !== secure.hashPassword(password)) {
        return res.status(400).send("Invalid password");
    }
    res.status(200).send({
        token: secure.generateToken(user),
        user
    });
});

//Update user
router.put("/:id", async (req, res) => {
    const {nom, post_nom, prenom, sexe, grade, password, email, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, {nom, post_nom, prenom, sexe, grade, password, email, role });
    if (!user) {
        return res.status(400).send("User not found");
    }
    res.status(200).send(user);
});

//Delete user
router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
        return res.status(400).send("User not found");
    }
    res.status(200).send(user);
});

module.exports = router;