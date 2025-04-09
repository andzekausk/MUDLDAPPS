const express = require("express");
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} = require("../services/rolesService");

const router = express.Router();
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

router.get("/roles", authenticateUser, authorizeRole(["laborants", "pārvaldnieks", "administrators"]), async (req, res) => {
    try {
        const roles = await getAllRoles();
        res.json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        res.status(500).json({ message: "Error fetching roles" });
    }
});

router.get("/roles/:roleId", authenticateUser, authorizeRole(["laborants", "pārvaldnieks", "administrators"]), async (req, res) => {
    try {
        const role = await getRoleById(req.params.roleId);
        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ message: "Role not found" });
        }
    } catch (error) {
        console.error("Error fetching role:", error);
        res.status(500).json({ message: "Error fetching role" });
    }
});

router.post("/roles", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
    try {
        const { name } = req.body;
        const newRoleId = await createRole(name);
        res.status(201).json({ message: "Role created successfully", roleId: newRoleId });
    } catch (error) {
        console.error("Error creating role:", error);
        res.status(500).json({ message: "Error creating role" });
    }
});

router.put("/roles/:roleId", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
    try {
        const { name } = req.body;
        await updateRole(req.params.roleId, name);
        res.json({ message: "Role updated successfully" });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({ message: "Error updating role" });
    }
});

router.delete("/roles/:roleId", authenticateUser, authorizeRole(["administrators"]), async (req, res) => {
    try {
        await deleteRole(req.params.roleId);
        res.json({ message: "Role deleted successfully" });
    } catch (error) {
        console.error("Error deleting role:", error);
        res.status(500).json({ message: "Error deleting role" });
    }
});

module.exports = router;
