const pool = require("../db");

async function createUser({ user_type, email, phone_number, is_active }) {
    const [result] = await pool.query(`
        INSERT INTO users (user_type, email, phone_number, is_active) 
        VALUES (?, ?, ?, ?)
    `, [user_type, email, phone_number, is_active]);

    return { user_id: result.insertId, user_type, email, phone_number, is_active };
}

async function getUsers() {
    const [rows] = await pool.query(`
        SELECT users.user_id, users.email, users.phone_number, users.user_type, users.is_active, local_users.username, 
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
        SELECT users.user_id, users.email, users.phone_number, users.user_type, users.is_active, local_users.username, 
        GROUP_CONCAT(roles.name) AS roles
        FROM users
        LEFT JOIN local_users ON users.user_id = local_users.user_id
        LEFT JOIN user_roles ON users.user_id = user_roles.user_id
        LEFT JOIN roles ON user_roles.role_id = roles.role_id
        WHERE users.user_id = ?
        GROUP BY users.user_id;
    `, [userId]);
    return rows[0] || null;
}

async function updateUser(userId, { phone_number, is_active }) {
    await pool.query(
        `UPDATE users SET phone_number = ?, is_active = ? WHERE user_id = ?`,
        [phone_number, is_active, userId]
    );
}

async function updateUserPhoneNumber(userId, phone_number) {
    await pool.query(
        `UPDATE users SET phone_number = ? WHERE user_id = ?`,
        [phone_number, userId]
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
    updateUserPhoneNumber,
    deleteUser
};
