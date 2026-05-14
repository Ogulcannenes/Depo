const { getIO } = require("../socket/socket");
const db = require("../database/database");

const updateProductStock = (id, stock, callback) => {
  db.get("SELECT stock FROM products WHERE id = ?", [id], (err, product) => {
    if (err) {
      return callback(err);
    }

    if (!product) {
      return callback({
        status: 404,
        message: "Ürün bulunamadı",
      });
    }

    const oldStock = product.stock;

    if (oldStock === stock) {
      return callback({
        status: 400,
        message: "Stock zaten aynı",
      });
    }

    db.run(
      "UPDATE products SET stock = ? WHERE id = ?",
      [stock, id],
      function (err) {
        if (err) {
          return callback(err);
        }

        db.run(
          `
                        INSERT INTO stock_history
                        (product_id, old_stock, new_stock)
                        VALUES (?, ?, ?)
                        `,
          [id, oldStock, stock],
        );
        const io = getIO();

        io.emit("stockUpdated", {
          productId: id,
          oldStock,
          newStock: stock,
        });

        callback(null, {
          message: "Stok güncellendi",
        });
      },
    );
  });
};

module.exports = {
  updateProductStock,
};
