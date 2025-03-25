const admin = require("firebase-admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
require("dotenv").config();

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

function generateToken(user) {
    return jwt.sign(
        { user_id: user.user_id, username: user.username, roles: user.roles },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );
}
async function loginWithGoogle(idToken) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const email = decodedToken.email;
        const allowedDomains = await getAllowedDomains();
        const isAllowed = allowedDomains.includes(email.split("@")[1]);
        if (!isAllowed) {
            return { error: "Email domain not allowed", status: 403 };
        }

        // for generating token
        const [userRows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        let user;
        if (userRows.length > 0) {
            user = userRows[0];
            // if user is deactivated don't allow login
            if (user.is_active == 0){
                isAllowed = false;
            }
        } else {
            return { email, isAllowed };
        }

        const roles = await getGoogleUserRoles(email);
        user.roles = roles;

        const token = generateToken(user);
        return { token, email, roles, isAllowed };
    } catch (error) {
        console.error("Error verifying token:", error);
        return { error: "Unauthorized", status: 401 };
    }
}

async function loginWithUsernamePassword(username, password) {
    let isAllowed = true;
    try {
        const [rows] = await pool.query(`
            SELECT * FROM users
            JOIN local_users ON users.user_id = local_users.user_id
            WHERE local_users.username = ?
        `, [username]);

        if (rows.length === 0) {
            return { error: "Invalid credentials", status: 401 };
        }

        const user = rows[0];
        // if user is deactivated don't allow login
        if (user.is_active == 0){
            isAllowed = false;
        }
        const passwordMatch = bcrypt.compareSync(password, user.password_hash);
        if (!passwordMatch) {
            return { error: "Invalid credentials", status: 401 };
        }

        const roles = await getUserRoles(user.username);
        const token = jwt.sign({ user_id: user.user_id, username: user.username, roles }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h",
        });

        return { token, email: user.email, roles, isAllowed };
    } catch (error) {
        console.error("Login error:", error);
        return { error: "Server error", status: 500 };
    }
}

async function verifyToken(token) {
    if (!token) {
        throw new Error("No token provided");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user roles from the database
        const [rows] = await pool.query(`
            SELECT roles.name 
            FROM user_roles
            JOIN roles ON user_roles.role_id = roles.role_id
            WHERE user_roles.user_id = ?
        `, [decoded.user_id]);

        const roles = rows.map(row => row.name);

        return {
            email: decoded.email,
            roles,
            isAllowed: true,
            token,
        };
    } catch (error) {
        throw new Error("Invalid token");
    }
}

module.exports = { loginWithGoogle, loginWithUsernamePassword, verifyToken };
