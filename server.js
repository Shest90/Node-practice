const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const router = express.Router();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));

app.use("/", router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

router.get("/files", (req, res) => {
  const directoryPath = path.join(__dirname, "uploads");

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Не удалось получить список файлов" });
    } else {
      res.status(200).json(files);
    }
  });
});

router.post("/files", (req, res) => {
  const { filename, content } = req.body;

  const filePath = path.join(__dirname, "uploads", filename);

  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "Не удалось сохранить файл" });
    } else {
      res.status(200).json({ message: "Файл успешно сохранен" });
    }
  });
});

router.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "uploads", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).json({ message: "Файл не найден" });
    } else {
      res.sendFile(filePath);
    }
  });
});

router.post("/login", (req, res) => {
  res.status(200).json({ message: "Авторизация успешна" });
});

app.listen(3000, () => {
  console.log("Сервер запущен");
});
