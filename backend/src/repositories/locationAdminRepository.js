const pool = require('../config/db');

class LocationAdminRepository {
  // --- Blocks ---
  async getBlocks(districtId) {
    let query = `
      SELECT b.*, d.name as district_name 
      FROM blocks b
      JOIN districts d ON b.district_id = d.id
    `;
    const params = [];
    if (districtId) {
      query += ` WHERE b.district_id = ?`;
      params.push(districtId);
    }
    query += ` ORDER BY b.name ASC`;
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getBlockById(id) {
    const result = await pool.query('SELECT * FROM blocks WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createBlock(id, districtId, name, isActive) {
    await pool.query(
      'INSERT INTO blocks (id, district_id, name, is_active) VALUES (?, ?, ?, ?)',
      [id, districtId, name, isActive]
    );
    return await this.getBlockById(id);
  }

  async updateBlock(id, name, isActive) {
    await pool.query(
      'UPDATE blocks SET name = COALESCE(?, name), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name, isActive, id]
    );
    return await this.getBlockById(id);
  }

  async deleteBlock(id) {
    await pool.query('DELETE FROM blocks WHERE id = ?', [id]);
  }

  // --- Panchayats ---
  async getPanchayats(blockId) {
    let query = `
      SELECT p.*, b.name as block_name, d.name as district_name 
      FROM panchayats p
      JOIN blocks b ON p.block_id = b.id
      JOIN districts d ON b.district_id = d.id
    `;
    const params = [];
    if (blockId) {
      query += ` WHERE p.block_id = ?`;
      params.push(blockId);
    }
    query += ` ORDER BY p.name ASC`;
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getPanchayatById(id) {
    const result = await pool.query('SELECT * FROM panchayats WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createPanchayat(id, blockId, name, isActive) {
    await pool.query(
      'INSERT INTO panchayats (id, block_id, name, is_active) VALUES (?, ?, ?, ?)',
      [id, blockId, name, isActive]
    );
    return await this.getPanchayatById(id);
  }

  async updatePanchayat(id, name, isActive) {
    await pool.query(
      'UPDATE panchayats SET name = COALESCE(?, name), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name, isActive, id]
    );
    return await this.getPanchayatById(id);
  }

  async deletePanchayat(id) {
    await pool.query('DELETE FROM panchayats WHERE id = ?', [id]);
  }

  // --- Villages ---
  async getVillages(panchayatId) {
    let query = `
      SELECT v.*, p.name as panchayat_name, b.name as block_name, d.name as district_name 
      FROM villages v
      JOIN panchayats p ON v.panchayat_id = p.id
      JOIN blocks b ON p.block_id = b.id
      JOIN districts d ON b.district_id = d.id
    `;
    const params = [];
    if (panchayatId) {
      query += ` WHERE v.panchayat_id = ?`;
      params.push(panchayatId);
    }
    query += ` ORDER BY v.name ASC`;
    const result = await pool.query(query, params);
    return result.rows;
  }

  async getVillageById(id) {
    const result = await pool.query('SELECT * FROM villages WHERE id = ?', [id]);
    return result.rows[0];
  }

  async createVillage(id, panchayatId, name, isActive) {
    await pool.query(
      'INSERT INTO villages (id, panchayat_id, name, is_active) VALUES (?, ?, ?, ?)',
      [id, panchayatId, name, isActive]
    );
    return await this.getVillageById(id);
  }

  async updateVillage(id, name, isActive) {
    await pool.query(
      'UPDATE villages SET name = COALESCE(?, name), is_active = COALESCE(?, is_active) WHERE id = ?',
      [name, isActive, id]
    );
    return await this.getVillageById(id);
  }

  async deleteVillage(id) {
    await pool.query('DELETE FROM villages WHERE id = ?', [id]);
  }
}

module.exports = new LocationAdminRepository();
