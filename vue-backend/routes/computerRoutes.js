const express = require("express");
const { getComputers, addComputer } = require("../services/computerService");

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

module.exports = router;