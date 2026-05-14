const { updateProductStock } = require("../services/productsService");
const prisma = require("../lib/prisma");

const getProducts = async (req, res) => {
  const search = req.query.search || "";

  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });

    res.send(products);
  } catch (error) {
    res.status(500).send({
      message: "Database hatası",
    });
  }
};

const createProduct = async (req, res) => {
  const { name, stock } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        stock,
      },
    });

    res.send({
      message: "Ürün eklendi",
      productId: product.id,
    });
  } catch (error) {
    res.status(500).send({
      message: "Database hatası",
    });
  }
};

const updateStock = async (req, res) => {
  const id = Number(req.params.id);

  const { stock } = req.body;

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

    if (existingProduct.stock === stock) {
      return res.status(400).send({
        message: "Stock zaten aynı",
      });
    }

    await prisma.$transaction([
      prisma.product.update({
        where: {
          id,
        },

        data: {
          stock,
        },
      }),

      prisma.stockHistory.create({
        data: {
          productId: id,
          oldStock: existingProduct.stock,
          newStock: stock,
        },
      }),
    ]);

    res.send({
      message: "Stok güncellendi",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Database hatası",
    });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateStock,
};
