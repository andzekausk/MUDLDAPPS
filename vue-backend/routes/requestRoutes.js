const express = require("express");
const {
  getRequests,
  getRequestById,
  createRequest,
  updateRequest,
  deleteRequest } = require("../services/requestService");

const router = express.Router();

router.get("/requests", async (req, res) => {
    try {
      const requests = await getRequests();
      res.json( requests );
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Error fetching requests" });
    }
  });

router.get("/requests/:id", async (req, res) => {
  try {
      const request = await getRequestById(req.params.id);
      if (!request) {
          return res.status(404).json({ message: "Request not found" });
      }
      res.json(request);
  } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).json({ message: "Error fetching request" });
  }
});

router.post("/requests", async (req, res) => {
  try {
      const { user_id, information, status } = req.body;
      const newRequest = await createRequest({ user_id, information, status });
      res.status(201).json(newRequest);
  } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Error creating request" });
  }
});

router.put("/requests/:id", async (req, res) => {
  try {
      const { information, status } = req.body;
      await updateRequest(req.params.id, { information, status });
      res.json({ message: "Request updated successfully" });
  } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ message: "Error updating request" });
  }
});

router.delete("/requests/:id", async (req, res) => {
  try {
      await deleteRequest(req.params.id);
      res.json({ message: "Request deleted successfully" });
  } catch (error) {
      console.error("Error deleting request:", error);
      res.status(500).json({ message: "Error deleting request" });
  }
});
  
  module.exports = router;