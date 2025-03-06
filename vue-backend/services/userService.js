const pool = require("../db");

async function createUser({ user_id, user_type, email }) {
    const [result] = await pool.query(`
        INSERT INTO users (user_id, user_type, email) 
        VALUES (?, ?, ?)
    `, [user_id, user_type, email]);

    return { user_id: result.insertId, user_type, email };
}

async function getUsers() {
    const [rows] = await pool.query(`SELECT * FROM users`);
    return rows;
}

async function getUserById(userId) {
    const [rows] = await pool.query(`SELECT * FROM users WHERE user_id = ?`, [userId]);
    return rows[0] || null;
}

async function updateUser(userId, { user_type, email }) {
    await pool.query(
        `UPDATE users SET user_type = ?, email = ? WHERE user_id = ?`,
        [user_type, email, userId]
    );
}

async function deleteUser(userId) {
    await pool.query(`DELETE FROM users WHERE user_id = ?`, [userId]);
}

module.exports = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};
