const express = require("express");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Folder untuk menyimpan file upload
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Menyajikan file statis dari folder uploads
app.use("/uploads", express.static("uploads"));

let data = [
  { id: 1, name: "Item 1", imageUrl: "" },
  { id: 2, name: "Item 2", imageUrl: "" },
  // ...Tambahkan data lainnya jika diperlukan
];

// Endpoint GET
app.get("/api/data", (req, res) => {
  res.json(data);
});

// Endpoint POST
app.post("/api/data", (req, res) => {
  const newItem = req.body;
  newItem.id = data.length + 1;
  data.push(newItem);
  res.status(201).json(newItem);
});

// Endpoint PUT
app.put("/api/data/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const updatedItem = req.body;
  data = data.map((item) => (item.id === itemId ? updatedItem : item));
  res.json(updatedItem);
});

// Endpoint DELETE
app.delete("/api/data/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  data = data.filter((item) => item.id !== itemId);
  res.status(204).end();
});

// Endpoint POST untuk upload foto
app.post("/api/data/upload", upload.single("image"), (req, res) => {
  const itemId = parseInt(req.query.id, 10);
  const itemIndex = data.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    data[itemIndex].imageUrl = req.file.filename;
    res.json({ success: true, imageUrl: req.file.filename });
  } else {
    res.status(404).json({ success: false, message: "Item not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
