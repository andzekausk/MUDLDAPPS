const express = require("express");
const { getComputers, addComputer, deleteComputer, updateComputer } = require("../services/computerService");

const router = express.Router();

router.get("/computers", async (req, res) => {
  try {
    const computers = await getComputers();
    res.json({ computers });
  } catch (error) {
    console.error("Error fetching computers:", error);
    res.status(500).json({ message: "Error fetching computers" });
  }
});

router.post("/computers", async (req, res) => {
  try {
    const { name, description, row, column } = req.body;
    if (!name || !row || !column) {
      return res.status(400).json({ message: "Missing needed fields!" });
    }

    const computerId = await addComputer({ name, description, row, column });
    res.status(201).json({ message: "Computer added!", computerId });
  } catch (error) {
    console.error("Error adding computer:", error);
    res.status(500).json({ message: "Error adding computer" });
  }
});

router.delete("/computers/:id", async (req, res) => {
  try {
      const { id } = req.params;
      await deleteComputer(id);
      res.json({ message: "Dators veiksmīgi izdzēsts" });
  } catch (error) {
      console.error("Error deleting computer:", error);
      res.status(500).json({ message: "Kļūda dzēšot datoru" });
  }
});

router.put("/computers/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const { name, description, row, column } = req.body;
      await updateComputer(id, {name, description, row, column});
      res.json({ message: "Dators veiksmīgi atjaunināts" });
  } catch (error) {
      console.error("Error updating computer:", error);
      res.status(500).json({ message: "Kļūda atjaunināšanā" });
  }
});

module.exports = router;