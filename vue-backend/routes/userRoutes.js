const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserPhoneNumber,
  deleteUser
} = require("../services/userService");

const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");
const jwt = require('jsonwebtoken');

router.get("/users", authenticateUser, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/users/:id", authenticateUser, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.post("/users", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
  try {
    const { user_id, user_type, email, phone_number, is_active } = req.body;
    const newUser = await createUser({ user_id, user_type, email, phone_number, is_active });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

router.put("/users/:id", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
  try {
    const { phone_number, is_active } = req.body;
    await updateUser(req.params.id, { phone_number, is_active });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user" });
  }
});

router.put("/user-assign-phone-number", authenticateUser, async (req, res) => {
  try {
    const {phone_number} = req.body;
    const userId = jwt.verify(req.user.token, process.env.JWT_SECRET).user_id;
    await updateUserPhoneNumber(userId, phone_number);
    res.json({ message: "User phone number updated successfully" });
  } catch (error) {
    console.error("Error updating user's phone number:", error);
    res.status(500).json({ message: "Error updating user's phone number" });
  }
});


router.delete("/users/:id", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

module.exports = router;
