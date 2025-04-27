import db from "../../config/dbconfig.js";

// Get all farms
export const getAllFarms = async (req, res) => {
  try {
    const [farms] = await db.execute(`
      SELECT f.*, u.user_name AS owner_name, u.email AS owner_email
      FROM farm f
      JOIN farm_owner fo ON f.owner_id = fo.id
      JOIN user u ON fo.user_id = u.id
    `);
    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Get farm by ID
export const getFarmById = async (req, res) => {
  const { farmId } = req.params;
  try {
    const [rows] = await db.execute(`
      SELECT f.*, u.user_name AS owner_name, u.email AS owner_email
      FROM farm f
      JOIN farm_owner fo ON f.owner_id = fo.id
      JOIN user u ON fo.user_id = u.id
      WHERE f.id = ?
    `, [farmId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Create a new farm
export const createFarm = async (req, res) => {
  const {
    owner_id,
    name,
    address,
    city,
    state,
    country,
    zip,
    status
  } = req.body;

  try {
    const [result] = await db.execute(`
      INSERT INTO farm (
        owner_id, name, address, city, state, country, zip,
        number_of_ponds, number_of_workers, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      owner_id, name, address, city, state, country, zip,
       0, 0, status || 'Active'
    ]);

    res.status(201).json({ message: "Farm created successfully", farmId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Update a farm
export const updateFarm = async (req, res) => {
  const { farmId } = req.params;
  const {
    owner_id,
    name,
    address,
    city,
    state,
    country,
    zip,
    status
  } = req.body;

  try {
    const [result] = await db.execute(`
      UPDATE farm
      SET owner_id = ?, name = ?, address = ?, city = ?, state = ?, country = ?, zip = ?,
           status = ?
      WHERE id = ?
    `, [
      owner_id, name, address, city, state, country, zip,
       status, farmId
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Farm not found or no changes made" });
    }

    res.status(200).json({ message: "Farm updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};


// Delete a farm
export const deleteFarm = async (req, res) => {
  const { farmId } = req.params;

  try {
    const [result] = await db.execute(`DELETE FROM farm WHERE id = ?`, [farmId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Farm not found" });
    }

    res.status(200).json({ message: "Farm deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};


// Get all farms by owner ID
export const getFarmsByOwnerId = async (req, res) => {
  const { ownerId } = req.params;
  try {
    const [farms] = await db.execute(`
      SELECT f.*, u.user_name AS owner_name, u.email AS owner_email
      FROM farm f
      JOIN farm_owner fo ON f.owner_id = fo.id
      JOIN user u ON fo.user_id = u.id
      WHERE f.owner_id = ?
    `, [ownerId]);

    res.status(200).json(farms);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

//change farm status
export const changeFarmStatus = async (req, res) => {
  const { farmId } = req.params;
  const { status } = req.body;

  try {
    const [result] = await db.execute(`
      UPDATE farm
      SET status = ?
      WHERE id = ?
    `, [status, farmId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Farm not found or no changes made" });
    }

    res.status(200).json({ message: "Farm status updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};