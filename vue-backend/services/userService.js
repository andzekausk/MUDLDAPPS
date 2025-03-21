const pool = require("../db");

async function createUser({ user_type, email }) {
    const [result] = await pool.query(`
        INSERT INTO users (user_type, email) 
        VALUES (?, ?)
    `, [user_type, email]);

    return { user_id: result.insertId, user_type, email };
}

async function getUsers() {
    const [rows] = await pool.query(`
        SELECT users.user_id, users.email, users.user_type, local_users.username, 
        GROUP_CONCAT(roles.name) AS roles
        FROM users
        LEFT JOIN local_users ON users.user_id = local_users.user_id
        LEFT JOIN user_roles ON users.user_id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.role_id
        GROUP BY users.user_id;
    `);
    return rows;
}

async function getUserById(userId) {
    const [rows] = await pool.query(`
        SELECT users.user_id, users.email, users.user_type, local_users.username, 
        GROUP_CONCAT(roles.name) AS roles
        FROM users
        LEFT JOIN local_users ON users.user_id = local_users.user_id
        LEFT JOIN user_roles ON users.user_id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.role_id
        GROUP BY users.user_id WHERE user_id = ?
    `, [userId]);
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
