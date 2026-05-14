const express = require("express");

const http = require("http");

const { Server } = require("socket.io");

const { setIO } = require("./src/socket/socket");

const productsRoutes = require("./src/routes/productsRoutes");

const historyRoutes = require("./src/routes/historyRoutes");

const authRoutes = require("./src/routes/authRoutes");

require("./src/database/database");

const app = express();

const server = http.createServer(app);

const io = new Server(server);

setIO(io);

app.use(express.json());

app.use(express.static("public"));

app.use("/auth", authRoutes);

app.use("/products", productsRoutes);

app.use("/history", historyRoutes);

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı");

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı");
  });
});

app.get("/", (req, res) => {
  res.send("Depo sistemi çalışıyor");
});

const db = require("./src/database/database");

app.get("/make-admin", (req, res) => {
  db.run(
    `
        UPDATE users
        SET role = 'admin'
        WHERE username = 'admin'
        `,
    function (err) {
      if (err) {
        return res.send(err.message);
      }

      res.send("Admin yapıldı");
    },
  );
});
server.listen(3000, () => {
  console.log("Server çalışıyor");
});
