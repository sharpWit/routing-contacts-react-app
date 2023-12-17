const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs").promises;

const app = express();
const port = 3001;
const dataFilePath = path.join(__dirname, "data", "data.json");

app.use(cors());
app.use(express.json());

// Ensure the data directory exists
const dataDirectory = path.join(__dirname, "data");
fs.mkdir(dataDirectory, { recursive: true }).catch((error) => {
  console.error("Error creating data directory:", error.message);
});

// Load existing data from file
let dataStore = [];
async function loadDataFromFile() {
  try {
    const dataFileContent = await fs.readFile(dataFilePath, "utf-8");
    dataStore = JSON.parse(dataFileContent);
  } catch (error) {
    console.error("Error reading data file:", error.message);
  }
}
loadDataFromFile();

// Save data to file function
const saveDataToFile = async () => {
  try {
    await fs.writeFile(
      dataFilePath,
      JSON.stringify(dataStore, null, 2),
      "utf-8"
    );
  } catch (error) {
    console.error("Error writing data to file:", error.message);
  }
};

// Route to handle POST requests and store data

app.post("/api/data/:id", (req, res) => {
  const newData = req.body;
  const newId = req.params.id; // Retrieve the id parameter from the URL

  console.log("Received POST request with payload and id:", newData, newId);

  if (newData && newId) {
    const newDataIdAsString = String(newId);
    const index = dataStore.findIndex(
      (item) => String(item.objectID) === newDataIdAsString
    );

    if (index === -1) {
      // Update the dataStore with the new data
      dataStore.push({ ...newData, objectID: newId });
      saveDataToFile();
      res.status(201).json({
        message: "Data successfully added",
        data: { items: [{ ...newData, objectID: newId }] },
      });
    } else {
      res.status(400).json({ error: "Item with the same ID already exists" });
    }
  } else {
    res.status(400).json({ error: "Invalid data format or missing ID" });
  }
});

// Route to get all data
app.get("/api/data", (req, res) => {
  res.json({ data: dataStore });
});

// Route to get a specific item by ID
app.get("/api/data/:id", (req, res) => {
  const itemId = req.params.id;
  const item = dataStore.find((item) => item.objectID === itemId);

  if (item) {
    res.json({ data: { items: [item] } });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Route to handle PATCH requests and update data
app.patch("/api/data/:id", (req, res) => {
  const itemId = req.params.id;
  const updatedData = req.body;
  console.log("Received PATCH request with payload:", updatedData);
  console.log("dataStore before update:", dataStore);
  const index = dataStore.findIndex((item) => item.objectID === itemId);

  if (index !== -1) {
    dataStore[index] = { ...dataStore[index], ...updatedData };
    saveDataToFile();
    res.status(200).json({
      message: "Data successfully updated",
      data: { items: [dataStore[index]] },
    });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
  console.log("dataStore after update:", dataStore);
});

// Route to handle DELETE requests and remove data
app.delete("/api/data/:id", (req, res) => {
  const itemId = req.params.id;
  const index = dataStore.findIndex((item) => item.objectID === itemId);

  if (index !== -1) {
    const deletedItem = dataStore.splice(index, 1)[0];
    saveDataToFile();
    res.status(200).json({
      message: "Data successfully deleted",
      data: { items: [deletedItem] },
    });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// Additional routes for demonstration purposes
app.post("/", (req, res) => {
  res.status(201).send("Thanks for adding something");
});

app.put("/:id", (req, res) => {
  res.status(200).send("Thanks for updating something");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
