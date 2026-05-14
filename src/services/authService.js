const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const db = require("../database/database");

const createUser = async (username, password, callback) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, existingUser) => {
      if (err) {
        return callback(err);
      }

      if (existingUser) {
        return callback({
          status: 400,
          message: "Kullanıcı zaten var",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        `
                INSERT INTO users (username, password)
                VALUES (?, ?)
                `,
        [username, hashedPassword],
        function (err) {
          if (err) {
            return callback(err);
          }

          callback(null, {
            message: "Kullanıcı oluşturuldu",
          });
        },
      );
    },
  );
};

const loginUser = (username, password, callback) => {
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback({
          status: 404,
          message: "Kullanıcı bulunamadı",
        });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return callback({
          status: 400,
          message: "Şifre yanlış",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        "supersecretkey",
        {
          expiresIn: "7d",
        },
      );

      callback(null, {
        message: "Giriş başarılı",
        token,
      });
    },
  );
};

module.exports = {
  createUser,
  loginUser,
};
