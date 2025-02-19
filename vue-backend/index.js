const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const admin = require("firebase-admin");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-adminsdk.json")), 
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

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

async function getComputers() {
  const [rows] = await pool.query(`
    SELECT 
        c.computer_id, c.name AS computer_name,
        os.name AS os_name, os.version AS os_version,
        GROUP_CONCAT(DISTINCT comp.name ORDER BY comp.name ASC) AS components,
        GROUP_CONCAT(DISTINCT s.name ORDER BY s.name ASC) AS software
    FROM computers c
    LEFT JOIN computer_os co ON c.computer_id = co.computer_id
    LEFT JOIN os ON co.os_id = os.os_id
    LEFT JOIN computer_components cc ON c.computer_id = cc.computer_id
    LEFT JOIN components comp ON cc.component_id = comp.component_id
    LEFT JOIN computer_os_software cos ON co.computer_os_id = cos.computer_os_id
    LEFT JOIN software s ON cos.software_id = s.software_id
    GROUP BY c.computer_id, c.name, os.name, os.version;
  `);
  return rows.map(row => ({
    computer_name: row.computer_name,
    os_name: row.os_name,
    os_version: row.os_version,
    components: row.components ? row.components.split(',') : [],
    software: row.software ? row.software.split(',') : []
  }));
}

app.get("/", (req, res) => {
  res.json({ message: "Mašīnmācīšanās un datorredzes laboratorijas datoru attālinātas piekļuves pārvaldības sistēma (MUDLDAPPS)" });
});

// Login Route
app.post("/login", async (req, res) => {
  const {idToken, username, password } = req.body;
  
  if(idToken){    // Firebase
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const email = decodedToken.email;
      const allowedDomains = await getAllowedDomains();
      const isAllowed = allowedDomains.includes(email.split("@")[1]);

      if (!isAllowed) {
        return res.status(403).json({ message: "Email domain not allowed" });
      }


      const roles = await getGoogleUserRoles(email);

      res.json({email, roles, isAllowed});
    } catch (error) {
      console.error("Error verifying token:", error);
      res.status(401).json({ message: "Unauthorized" });
    }
  } else if (username && password){   //MySql
      try{
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

app.get("/api/computers", async (req, res) => {
  try {
    const computers = await getComputers();
    res.json({ computers });
  } catch (error) {
    console.error('Error fetching computers:', error);
    res.status(500).json({ message: 'Error fetching computers' });
  }
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});