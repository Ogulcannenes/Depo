const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const { getProductHistory } = require("../controllers/historyController");

router.get("/", authMiddleware, getProductHistory);

module.exports = router;
