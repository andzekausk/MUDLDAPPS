const pool = require("../db");

async function createRequest({ user_id, information, status }) {
    const [result] = await pool.query(`
        INSERT INTO requests (user_id, information, status, created_at) 
        VALUES (?, ?, ?, NOW())
    `,[user_id, information, status]
    );
    return { request_id: result.insertId, user_id, information, status };
}

async function getRequests() {
    const [rows] = await pool.query(`SELECT * FROM requests`);
    return rows;
}

async function getRequestById(requestId) {
    const [rows] = await pool.query(`SELECT * FROM requests WHERE request_id = ?`, [requestId]);
    return rows[0] || null;
}

 async function updateRequest(requestId, { information, status }) {
    await pool.query(
        `UPDATE requests SET information = ?, status = ? WHERE request_id = ?`,
        [information, status, requestId]
    );
}

async function deleteRequest(requestId) {
    await pool.query(`DELETE FROM requests WHERE request_id = ?`, [requestId]);
}

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest
};