const pool = require("../db");

async function getAllRoles() {
    const [rows] = await pool.execute(`
        SELECT role_id, name 
        FROM roles
    `);
    return rows;
}

async function getRoleById(roleId) {
    const [rows] = await pool.execute(`
        SELECT role_id, name 
        FROM roles
        WHERE role_id = ?
    `, [roleId]);
    return rows[0];
}

async function createRole(name) {
    const [result] = await pool.execute(`
        INSERT INTO roles (name) 
        VALUES (?)`, [name]
    );
    return result.insertId;
}

async function updateRole(roleId, name) {
    await pool.execute(`
        UPDATE roles 
        SET name = ? 
        WHERE role_id = ?`, [name, roleId]
    );
}

async function deleteRole(roleId) {
    await pool.execute(`
        DELETE FROM roles 
        WHERE role_id = ?`, [roleId]
    );
}

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
};
