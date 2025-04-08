const express = require("express");
const {
    createLocalUser,
    getLocalUsers,
    getLocalUserById,
    updateLocalUser,
    deleteLocalUser
} = require("../services/localUserService");

const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.get("/local_users", authenticateUser, async (req, res) => {
  try {
    const users = await getLocalUsers();
    res.json(users);
  } catch (error) {
    console.error("Error fetching local users:", error);
    res.status(500).json({ message: "Error fetching local users" });
  }
});

router.get("/local_users/:id", authenticateUser, async (req, res) => {
  try {
    const user = await getLocalUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Local user not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching local user:", error);
    res.status(500).json({ message: "Error fetching local user" });
  }
});

router.post("/local_users", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
  try {
    const { user_id, username, password_hash } = req.body;
    const newLocalUser = await createLocalUser({ user_id, username, password_hash });
    res.status(201).json(newLocalUser);
  } catch (error) {
    console.error("Error creating local user:", error);
    res.status(500).json({ message: "Error creating local user" });
  }
});

router.put("/local_users/:id", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
  try {
    const { username, password_hash } = req.body;
    await updateLocalUser(req.params.id, { username, password_hash });
    res.json({ message: "Local user updated successfully" });
  } catch (error) {
    console.error("Error updating local user:", error);
    res.status(500).json({ message: "Error updating local user" });
  }
});

router.delete("/local_users/:id", authenticateUser, authorizeRole(["administrators"]),  async (req, res) => {
  try {
    await deleteLocalUser(req.params.id);
    res.json({ message: "Local user deleted successfully" });
  } catch (error) {
    console.error("Error deleting local user:", error);
    res.status(500).json({ message: "Error deleting local user" });
  }
});

module.exports = router;
