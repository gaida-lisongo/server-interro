const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoutes"));
router.use("/cours", require("./coursRoutes"));
router.use("/serie", require("./serieRoutes"));
router.use("/groupe", require("./groupeRoutes"));
router.use("/etudiant", require("./etudiantRoutes"));
router.use("/resolution", require("./resolutionRoutes"));

module.exports = router;
