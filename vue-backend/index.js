const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

async function getUserRoles(username) {
  const [rows] = await pool.query(`
      SELECT roles.name 
      FROM user_roles
      JOIN users ON user_roles.user_id = users.user_id
      JOIN roles ON user_roles.role_id = roles.role_id
      WHERE users.username = ?
  `, [username]);

  return rows.map(row => row.name);
}

app.get("/", (req, res) => {
  res.json({ message: "Mašīnmācīšanās un datorredzes laboratorijas datoru attālinātas piekļuves pārvaldības sistēma (MUDLDAPPS)" });
});

// Login Route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (username && password){   //MySql
      try{
          const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [username]);
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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});