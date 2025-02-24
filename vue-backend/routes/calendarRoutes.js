const express = require("express");
const { getReservations } = require("../services/calendarService");

const router = express.Router();

router.get("/api/reservations", async (req, res) => {
    try {
      const reservations = await getReservations();
      res.json( reservations );
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Error fetching reservations" });
    }
  });

  module.exports = router;