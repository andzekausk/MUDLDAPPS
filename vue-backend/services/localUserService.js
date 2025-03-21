const pool = require("../db");

async function createLocalUser({ user_id, username, password_hash }) {
    const [result] = await pool.query(`
        INSERT INTO local_users (user_id, username, password_hash) 
        VALUES (?, ?, ?)
    `, [user_id, username, password_hash]);

    return { user_id: result.insertId, username, password_hash };
}

async function getLocalUsers() {
    const [rows] = await pool.query(`
        SELECT * local_users;
    `);
    return rows;
}

async function getLocalUserById(localUserId) {
    const [rows] = await pool.query(`
        SELECT * FROM local_users WHERE local_user_id = ?
    `, [localUserId]);
    return rows[0] || null;
}

async function updateLocalUser(localUserId, { username, password_hash }) {
    await pool.query(
        `UPDATE local_users SET username = ?, password_hash = ? WHERE local_user_id = ?`,
        [username, password_hash, localUserId]
    );
}

async function deleteLocalUser(userId) {
    await pool.query(`DELETE FROM local_users WHERE user_id = ?`, [userId]);
}



module.exports = {
    createLocalUser,
    getLocalUsers,
    getLocalUserById,
    updateLocalUser,
    deleteLocalUser
};
