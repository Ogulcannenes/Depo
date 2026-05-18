const { updateProductStock } = require("../services/productsService");
const prisma = require("../lib/prisma");
const { getIO } = require("../socket/socket");

const getProducts = async (req, res) => {
  const search = req.query.search || "";

  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 6;

  const skip = (page - 1) * limit;

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: search,
      },
    },

    skip,

    take: limit,
  });

  res.send(products);
};

const getStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();

    const products = await prisma.product.findMany();

    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0,
    );

    const lowStock = products.filter((product) => product.stock < 10).length;

    const totalHistory = await prisma.stockHistory.count();

    res.send({
      totalProducts,
      totalStock,
      lowStock,
      totalHistory,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Database hatası",
    });
  }
};

const createProduct = async (req, res) => {
  const { name, stock } = req.body;

  const stockNumber = Number(stock);

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const product = await prisma.product.create({
    data: {
      name,
      stock: stockNumber,
      image,
    },
  });

  getIO().emit("productUpdated");

  res.send({
    message: "Ürün eklendi",
    productId: product.id,
  });
};

const updateStock = async (req, res) => {
  const id = Number(req.params.id);

  const { stock } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!existingProduct) {
      return res.status(404).send({
        message: "Ürün bulunamadı",
      });
    }

    const updateData = {
      ...(stock && {
        stock: Number(stock),
      }),

      ...(image && {
        image,
      }),
    };

    await prisma.product.update({
      where: {
        id,
      },

      data: updateData,
    });

    if (stock) {
      await prisma.stockHistory.create({
        data: {
          productId: id,

          oldStock: existingProduct.stock,

          newStock: Number(stock),
        },
      });
    }

    getIO().emit("productUpdated");

    res.send({
      message: "Ürün güncellendi",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Database hatası",
    });
  }
};

const deleteProduct = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.stockHistory.deleteMany({
      where: {
        productId: id,
      },
    });

    await prisma.product.delete({
      where: {
        id,
      },
    });

    getIO().emit("productUpdated");

    res.send({
      message: "Ürün silindi",
    });
  } catch (error) {
    res.status(500).send({
      message: "Database hatası",
    });
  }
};

module.exports = {
  getProducts,

  createProduct,

  updateStock,

  getStats,

  deleteProduct,
};
