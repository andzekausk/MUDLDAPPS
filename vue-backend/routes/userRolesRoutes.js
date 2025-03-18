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

router.post('/user_roles/update', async (req, res) => {
    try {
      const { userId, roleIds } = req.body;
  
      await db.execute('DELETE FROM user_roles WHERE user_id = ?', [userId]); // Remove existing roles
  
      if (roleIds.length > 0) {
        const values = roleIds.map(roleId => [userId, roleId]);
        await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ?', [values]);
      }
  
      res.json({ message: 'Roles updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating roles' });
    }
  });
  
router.put('/user_roles/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { role_ids } = req.body; // array of role_ids

    try {
        await db.query("DELETE FROM user_roles WHERE user_id = ?", [user_id]);

        if (role_ids.length > 0) {
            const values = role_ids.map(role_id => [user_id, role_id]);
            await db.query("INSERT INTO user_roles (user_id, role_id) VALUES ?", [values]);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Error updating user roles:", error);
        res.status(500).json({ error: "Failed to update roles" });
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