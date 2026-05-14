const express = require("express");

const router = express.Router();

const { getProductHistory } = require("../controllers/historyController");

router.get("/:productId", getProductHistory);

module.exports = router;
