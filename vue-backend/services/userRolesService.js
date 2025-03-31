const pool = require("../db");

async function getUserRoles(userId) {
    const [rows] = await pool.execute(`
    SELECT roles.role_id, roles.name FROM user_roles 
    JOIN roles ON user_roles.role_id = roles.role_id
    WHERE user_roles.user_id = ?
    ORDER BY roles.role_id;
    `, [userId]);
return rows;
}

async function assignRole(userId, roleId) {
    if (!userId || !roleId) {
        throw new Error(`Invalid input: userId=${userId}, roleId=${roleId}`);
    }

    const [existing] = await pool.execute(`
    SELECT * FROM user_roles WHERE user_id = ? AND role_id = ?
    `, [userId, roleId]);

    if (existing.length > 0) {
        console.log(`Role ${roleId} is already assigned to user ${userId}, skipping.`);
        return;
    }
    await pool.execute(`
    INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)`
    , [userId, roleId]);
}

async function removeRole(userId, roleId) {
    if (!userId || !roleId) {
        throw new Error(`Invalid input: userId=${userId}, roleId=${roleId}`);
    }
    
    await pool.execute(`
    DELETE FROM user_roles WHERE user_id = ? AND role_id = ?
    `, [userId, roleId]);
}

async function getAllUserRoles() {
    const [rows] = await pool.execute(`
    SELECT user_roles.user_id, users.email, roles.name AS role 
    FROM user_roles 
    JOIN users ON user_roles.user_id = users.user_id
    JOIN roles ON user_roles.role_id = roles.role_id
    `);
    return rows;
}

module.exports = {
    getUserRoles,
    assignRole,
    removeRole,
    getAllUserRoles,
}
