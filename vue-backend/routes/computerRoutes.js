const express = require("express");
const { getComputers } = require("../services/computerService");

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

module.exports = router;