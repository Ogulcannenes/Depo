const express = require("express");

const router = express.Router();

const {
  getProducts,
  createProduct,
  updateStock,
} = require("../controllers/productsController");

const validateStock = require("../middlewares/stockValidation");

const authMiddleware = require("../middlewares/authMiddleware");

const adminMiddleware = require("../middlewares/adminMiddleware");

router.get("/", getProducts);

router.post("/", createProduct);

router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  validateStock,
  updateStock,
);

module.exports = router;
