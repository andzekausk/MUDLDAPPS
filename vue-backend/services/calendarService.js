const pool = require("../db");

async function getReservations() {
    const [rows] = await pool.query(`
        SELECT reservation_id, computer_id, from_time, to_time FROM reservations
    `);
      
    return rows.map(row => ({
        name: `Datora id: ${row.computer_id}`,
        start: new Date(row.from_time),
        end: new Date(row.to_time),
        color: "blue",
    }));
}

module.exports = {
    getReservations
};