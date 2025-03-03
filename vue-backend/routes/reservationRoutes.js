const express = require("express");
const { 
  getReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation } = require("../services/reservationService");

const router = express.Router();

router.get("/reservations", async (req, res) => {
    try {
      const reservations = await getReservations();
      res.json( reservations );
    } catch (error) {
      console.error("Error fetching reservations:", error);
      res.status(500).json({ message: "Error fetching reservations" });
    }
  });

router.get("/reservations/:id", async (req, res) => {
    try {
        const reservation = await getReservationById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }
        res.json(reservation);
    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ message: "Error fetching reservation" });
    }
});

// Izveidot jaunu rezervāciju
router.post("/reservations", async (req, res) => {
    try {
        const { computer_id, request_id, from_time, to_time } = req.body;
        const newReservation = await createReservation({ computer_id, request_id, from_time, to_time });
        res.status(201).json(newReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Error creating reservation" });
    }
});

// Atjaunināt rezervāciju
router.put("/reservations/:id", async (req, res) => {
    try {
        const { from_time, to_time } = req.body;
        await updateReservation(req.params.id, { from_time, to_time });
        res.json({ message: "Reservation updated successfully" });
    } catch (error) {
        console.error("Error updating reservation:", error);
        res.status(500).json({ message: "Error updating reservation" });
    }
});

// Dzēst rezervāciju
router.delete("/reservations/:id", async (req, res) => {
    try {
        await deleteReservation(req.params.id);
        res.json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({ message: "Error deleting reservation" });
    }
});

  module.exports = router;