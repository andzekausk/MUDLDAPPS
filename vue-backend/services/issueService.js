const pool = require("../db");

async function createIssue({ user_id, title, description }) {
    const [result] = await pool.query(`
        INSERT INTO issues (user_id, title, description, created_at) 
        VALUES (?, ?, ?, NOW())
    `, [user_id, title, description]);
    return { issue_id: result.insertId, user_id, title, description };
}

async function createIssueComputers(issue_id, computer_ids) {
    const values = computer_ids.map(id => [issue_id, id])
    await pool.query(`
        INSERT INTO issue_computers (issue_id, computer_id)
        VALUES ?
    `, [values]);
}

async function getIssues() {
    const [rows] = await pool.query(`
        SELECT i.issue_id, i.user_id, u.email, i.title, i.description, i.status, i.created_at
        FROM issues i
        JOIN users u ON i.user_id = u.user_id
        ORDER BY i.created_at DESC
    `);
    return rows;
}

async function getIssueById(issue_id) {
    const [rows] = await pool.query(`
        SELECT * FROM issues WHERE issue_id = ?
    `, [issue_id]);
    return rows[0] || null;
}

async function getComputersForIssue(issue_id) {
    const [rows] = await pool.query(`
        SELECT c.computer_id, c.name AS computer_name, ic.status
        FROM issue_computers ic
        JOIN computers c ON ic.computer_id = c.computer_id
        WHERE ic.issue_id = ?
    `, [issue_id]);
    return rows;
}

async function updateIssueStatus(issue_id, status) {
    await pool.query(`
        UPDATE issues SET status = ?
        WHERE issue_id = ?
    `, [status, issue_id]);
}

async function updateIssueComputerStatus(issue_id, computer_id, status) {
    await pool.query(`
        UPDATE issue_computers
        SET status = ?
        WHERE issue_id = ? AND computer_id = ?
    `, [status, issue_id, computer_id]);
}

module.exports = {
    createIssue,
    createIssueComputers,
    getIssues,
    getIssueById,
    getComputersForIssue,
    updateIssueStatus,
    updateIssueComputerStatus,
};