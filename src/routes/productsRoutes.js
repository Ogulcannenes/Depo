const upload = require("../middlewares/upload");

const express = require("express");

const router = express.Router();

const {
  getProducts,

  createProduct,

  updateStock,

  deleteProduct,

  getStats,
} = require("../controllers/productsController");

const validateStock = require("../middlewares/stockValidation");

const productValidation = require("../middlewares/productValidation");

const authMiddleware = require("../middlewares/authMiddleware");

const adminMiddleware = require("../middlewares/adminMiddleware");

const asyncHandler = require("../middlewares/asyncHandler");

router.delete(
  "/:id",

  authMiddleware,

  adminMiddleware,

  asyncHandler(deleteProduct),
);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Tüm ürünleri getir
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Ürün listesi
 */

router.get("/stats", getStats);
router.get("/", asyncHandler(getProducts));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Yeni ürün oluştur
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Ürün oluşturuldu
 */

router.post(
  "/",

  upload.single("image"),

  productValidation,

  asyncHandler(createProduct),
);

/**
 * @swagger
 * /products/{id}:
 *   patch:
 *     summary: Ürün stok güncelle
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stock güncellendi
 */

router.patch(
  "/:id",

  upload.single("image"),

  authMiddleware,

  asyncHandler(updateStock),
);

module.exports = router;
