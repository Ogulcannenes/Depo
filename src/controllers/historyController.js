const prisma = require("../lib/prisma");

const getProductHistory = async (req, res) => {
  const productId = Number(req.params.productId);
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 5;

  const skip = (page - 1) * limit;

  try {
    const history = await prisma.stockHistory.findMany({
      where: {
        productId,
      },

      include: {
        product: true,
      },

      orderBy: {
        changedAt: "desc",
      },

      skip,

      take: limit,
    });

    res.send(history);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      message: "Database hatası",
    });
  }
};

module.exports = {
  getProductHistory,
};
