const express = require("express");
const { chatWithAI } = require("../controller/aiController");

const router = express.Router();

router.post("/chat", chatWithAI);

module.exports = router;