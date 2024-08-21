const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { getStoredItems, storeItems } = require("./data/items");

const app = express();

// Handling cors
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET, POST, DELETE, PATCH, PUT, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const PORT = 8080;

app.get("/", function (req, res) {
  res.send("Welcome");
});

app.get("/items", async (req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
  res.json({ items: storedItems });
});

app.get("/items/:id", async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

app.post("/items", async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: "Stored new item.", item: newItem });
});

app.listen(PORT, () => {
  console.log("Listening on port 8080");
});
