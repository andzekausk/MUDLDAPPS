const pool = require("../db");

async function getComputers() {
    const [computers] = await pool.query(`
      SELECT computer_id, name AS computer_name
      FROM computers
    `);
  
    for (const computer of computers) {
      const osList = await getComputerOS(computer.computer_id);
      const components = await getComputerComponents(computer.computer_id);
  
      computer.os_details = [];
      for (const os of osList) {
        const software = await getComputerOsSoftware(os.computer_os_id);
        computer.os_details.push({
          os_name: os.os_name,
          os_version: os.os_version,
          software: software.length > 0 ? software : ["Nav instalēta"]
        });
      }
  
      computer.components = components.length > 0 ? components : ["Nav pieejamas"];
    }
  
    return computers;
  }
  
  async function getComputerOS(computerId) {
    const [rows] = await pool.query(`
      SELECT co.computer_os_id, os.name AS os_name, os.version AS os_version
      FROM computer_os co
      LEFT JOIN os ON co.os_id = os.os_id
      WHERE co.computer_id = ?
    `, [computerId]);
    return rows;
  }
  
  async function getComputerComponents(computerId) {
    const [rows] = await pool.query(`
      SELECT comp.name
      FROM computer_components cc
      LEFT JOIN components comp ON cc.component_id = comp.component_id
      WHERE cc.computer_id = ?
    `, [computerId]);
    return rows.map(row => row.name);
  }
  
  async function getComputerOsSoftware(computerOsId) {
    const [rows] = await pool.query(`
      SELECT s.name
      FROM computer_os_software cos
      LEFT JOIN software s ON cos.software_id = s.software_id
      WHERE cos.computer_os_id = ?
    `, [computerOsId]);
    return rows.map(row => row.name);
  }

  module.exports = {
    getComputers
  };