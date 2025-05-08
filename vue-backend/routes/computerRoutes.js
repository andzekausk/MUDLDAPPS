const express = require("express");
const {
  getComputers,
  addComputer,
  deleteComputer,
  updateComputer,

  getComponents,
  addComponent,
  deleteComponent,
  updateComponent,

  getOS,
  addOS,
  deleteOS,
  updateOS, } = require("../services/computerService");

const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.get("/computers", authenticateUser, async (req, res) => {
  try {
    const computers = await getComputers();
    res.json({ computers });
  } catch (error) {
    console.error("Error fetching computers:", error);
    res.status(500).json({ message: "Error fetching computers" });
  }
});

router.post("/computers", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
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

router.delete("/computers/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    await deleteComputer(id);
    res.json({ message: "Dators veiksmīgi izdzēsts" });
  } catch (error) {
    console.error("Error deleting computer:", error);
    res.status(500).json({ message: "Kļūda dzēšot datoru" });
  }
});

router.put("/computers/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, row, column } = req.body;
    await updateComputer(id, { name, description, row, column });
    res.json({ message: "Dators veiksmīgi atjaunināts" });
  } catch (error) {
    console.error("Error updating computer:", error);
    res.status(500).json({ message: "Kļūda atjaunināšanā" });
  }
});

router.get("/components", authenticateUser, async (req, res) => {
  try {
    const components = await getComponents();
    res.json({ components });
  } catch (error) {
    console.error("Error fetching components:", error);
    res.status(500).json({ message: "Error fetching components" });
  }
});

router.post("/components", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { name, category, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Missing name!" });
    }

    const componentId = await addComponent({ name, category, description });
    res.status(201).json({ message: "Component added!", componentId });
  } catch (error) {
    console.error("Error adding component:", error);
    res.status(500).json({ message: "Error adding component" });
  }
});

router.delete("/components/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    await deleteComponent(id);
    res.json({ message: "Komponente veiksmīgi izdzēsta" });
  } catch (error) {
    console.error("Error deleting component:", error);
    res.status(500).json({ message: "Kļūda dzēšanā" });
  }
});

router.put("/components/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description } = req.body;
    await updateComponent(id, { name, category, description });
    res.json({ message: "Komponente veiksmīgi atjaunināta" });
  } catch (error) {
    console.error("Error updating component:", error);
    res.status(500).json({ message: "Kļūda atjaunināšanā" });
  }
});

router.get("/os", authenticateUser, async (req, res) => {
  try {
    const os = await getOS();
    res.json({ os });
  } catch (error) {
    console.error("Error fetching OS:", error);
    res.status(500).json({ message: "Error fetching OS" });
  }
});

router.post("/os", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { name, version } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Missing name!" });
    }

    const osId = await addOS({ name, version });
    res.status(201).json({ message: "OS added!", osId });
  } catch (error) {
    console.error("Error adding OS:", error);
    res.status(500).json({ message: "Error adding OS" });
  }
});

router.delete("/os/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    await deleteOS(id);
    res.json({ message: "OS veiksmīgi izdzēsta" });
  } catch (error) {
    console.error("Error deleting OS:", error);
    res.status(500).json({ message: "Kļūda dzēšanā" });
  }
});

router.put("/os/:id", authenticateUser, authorizeRole(["administrators", "pārvaldnieks"]), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, version } = req.body;
    await updateOS(id, { name, version });
    res.json({ message: "OS veiksmīgi atjaunināta" });
  } catch (error) {
    console.error("Error updating OS:", error);
    res.status(500).json({ message: "Kļūda atjaunināšanā" });
  }
});

module.exports = router;