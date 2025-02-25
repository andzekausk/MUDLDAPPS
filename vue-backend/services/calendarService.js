const pool = require("../db");

async function getReservations() {
    const [rows] = await pool.query(`
        SELECT r.reservation_id, r.computer_id, r.from_time, r.to_time, c.name 
        FROM reservations r
        JOIN computers c ON r.computer_id = c.computer_id
    `);
    const colors = [ // colors for specific id
        "#FFDDC1", "#FFABAB","#FFC3A0","#D5AAFF",
        "#85E3FF", "#B9FBC0", "#AFCBFF",  "#FFE7A0",
        "#FFCBCB","#B5EAD7","#E2F0CB", "#F3B0C3"
      ];        
    return rows.map(row => ({
        name: `\n${row.name}`,
        start: new Date(row.from_time),
        end: new Date(row.to_time),
        color: colors[row.computer_id % colors.length],
    }));
}

module.exports = {
    getReservations
};