const express = require("express");
const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const pool = require("../db");

const router = express.Router();

async function getUserRoles(username) {
  const [rows] = await pool.query(`
    SELECT roles.name
    FROM local_users
    JOIN users ON local_users.user_id = users.user_id
    JOIN user_roles ON users.user_id = user_roles.user_id
    JOIN roles ON user_roles.role_id = roles.role_id
    WHERE local_users.username = ?
  `, [username]);

  return rows.map(row => row.name);
}

async function getGoogleUserRoles(email) {
  const [rows] = await pool.query(`
    SELECT roles.name 
    FROM user_roles
    JOIN users ON user_roles.user_id = users.user_id
    JOIN roles ON user_roles.role_id = roles.role_id
    WHERE users.user_type = "google"
    AND users.email = ?
  `, [email]);

  return rows.map(row => row.name);
}

async function getAllowedDomains() {
  const [rows] = await pool.query("SELECT domain FROM allowed_domains");
  return rows.map(row => row.domain);
}

router.post("/login", async (req, res) => {
  const { idToken, username, password } = req.body;

  if (idToken) { // Firebase login
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const email = decodedToken.email;
      const allowedDomains = await getAllowedDomains();
      const isAllowed = allowedDomains.includes(email.split("@")[1]);

      if (!isAllowed) {
        return res.status(403).json({ message: "Email domain not allowed" });
      }

      const roles = await getGoogleUserRoles(email);
      res.json({ email, roles, isAllowed });
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  } else if (username && password) { // MySQL login
    try {
      const [rows] = await pool.query(`
        SELECT * FROM users
        JOIN local_users ON users.user_id = local_users.user_id
        WHERE local_users.username = ?
      `, [username]);

      if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

      const user = rows[0];
      if (!bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const roles = await getUserRoles(user.username);
      return res.json({ email: user.email, roles, isAllowed: true });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
});

module.exports = router;
