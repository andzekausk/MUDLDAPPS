const express = require("express");
const {
    getUserRoles,
    assignRole,
    removeRole,
    getAllUserRoles,
} = require("../services/userRolesService");

const router = express.Router();

router.get("/user_roles/:userId", async (req, res) => {
    try {
        const roles = await getUserRoles(req.params.userId);
        res.json(roles);
    } catch (error) {
        console.error("Error fetching user roles:", error);
        res.status(500).json({ message: "Error fetching user roles" });
    }
});

router.post('/user_roles/assign', async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        await assignRole(userId, roleId);
        res.status(201).json({ message: "Role assigned successfully" });
    } catch (error) {
        console.error("Error assigning role:", error);
        res.status(500).json({ message: "Error assigning role" });
    }
});
  
router.delete('/user_roles/remove', async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        await removeRole(userId, roleId);
        res.json({ message: "Role removed successfully" });
    } catch (error) {
        console.error("Error  removing role: ", error);
        res.status(500).json({ message: "Error removing role" });
    }
});
  
router.get('/user_roles', async (req, res) => {
    try {
        const userRoles = await getAllUserRoles();
        res.json(userRoles);
    } catch (error) {
        console.error("Error fetching user roles:", error);
        res.status(500).json({ message: "Error fetching user roles" });
    }
});
  
module.exports = router;