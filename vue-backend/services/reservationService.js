const pool = require("../db");

async function createReservation({ computer_id, request_id, from_time, to_time }) {
    const [result] = await pool.query(
        `INSERT INTO reservations (computer_id, request_id, from_time, to_time) VALUES (?, ?, ?, ?)`,
        [computer_id, request_id, from_time, to_time]
    );
    return { reservation_id: result.insertId, computer_id, request_id, from_time, to_time };
}

async function getReservations() {
    const [rows] = await pool.query(`
        SELECT r.reservation_id, r.computer_id, r.request_id, r.from_time, r.to_time, c.name, req.status
        FROM reservations r
        JOIN computers c ON r.computer_id = c.computer_id
        JOIN requests req ON req.request_id = r.request_id
    `);
    const colors = [ // colors for specific id
        "#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF",
        "#85E3FF", "#B9FBC0", "#AFCBFF", "#FFE7A0",
        "#FFCBCB", "#B5EAD7", "#E2F0CB", "#F3B0C3"
    ];
    return rows.map(row => ({
        name: `\n${row.name}`,
        computer_id: row.computer_id,
        request_id: row.request_id,
        start: new Date(row.from_time),
        end: new Date(row.to_time),
        status: row.status,
        color: row.status === "approved" ? colors[row.computer_id % colors.length] : "LightGrey", // TODO: need to change for a more sensical way to do this
    }));
}

async function getReservationById(reservationId) {
    const [rows] = await pool.query(`SELECT * FROM reservations WHERE reservation_id = ?`, [reservationId]);
    return rows[0] || null;
}

async function getReservationsByRequestId(requestId) {
    const [rows] = await pool.query(`
        SELECT r.reservation_id, r.computer_id, c.name as computer_name, r.from_time, r.to_time
        FROM reservations r
        LEFT JOIN computers c ON r.computer_id = c.computer_id
        WHERE r.request_id = ?
    `, [requestId]);
    return rows;
}

async function updateReservation(reservationId, { from_time, to_time }) {
    await pool.query(
        `UPDATE reservations SET from_time = ?, to_time = ? WHERE reservation_id = ?`,
        [from_time, to_time, reservationId]
    );
}

async function deleteReservation(reservationId) {
    await pool.query(`DELETE FROM reservations WHERE reservation_id = ?`, [reservationId]);
}

async function getApprovedReservations(from_time, to_time) {
    const [rows] = await pool.query(`
        SELECT
        r.reservation_id,
        r.computer_id,
        c.name AS computer_name,
        r.from_time,
        r.to_time
        FROM reservations r
        JOIN requests req ON r.request_id = req.request_id
        JOIN computers c ON r.computer_id = c.computer_id
        WHERE DATE(r.from_time) >= ? AND DATE(r.to_time) <= ?
        AND req.status = 'approved';
    `, [from_time, to_time]);
    return rows;
}

module.exports = {
    createReservation,
    getReservations,
    getReservationById,
    getReservationsByRequestId,
    updateReservation,
    deleteReservation,
    getApprovedReservations,
};