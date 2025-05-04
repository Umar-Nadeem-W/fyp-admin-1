import db from "../../config/dbconfig.js";

// Get all farm owners
//update get all farm owners controller get username from user using user id


export const getAllFarmOwners = async (req, res) => {
  try {
    const [owners] = await db.execute(`
      SELECT
        fo.*,
        u.user_name AS owner_name
      FROM farm_owner fo
      JOIN user u ON fo.user_id = u.id
    `);
    res.status(200).json(owners);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Get a single farm owner by ID
export const getFarmOwnerById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute("SELECT * FROM farm_owner WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Farm owner not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Create a new farm owner
export const createFarmOwner = async (req, res) => {
  const { user_id, status } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id field" });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO farm_owner (user_id, status, registration_date)
       VALUES (?, ?, NOW())`,
      [user_id, status || "Active"]
    );
    res.status(201).json({ message: "Farm owner created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};


// Update a farm owner
export const updateFarmOwner = async (req, res) => {
  const { id } = req.params;
  const { user_id, status } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "Missing user_id field" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE farm_owner
       SET user_id = ?, status = ?
       WHERE id = ?`,
      [user_id, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Farm owner not found or no changes made" });
    }

    res.status(200).json({ message: "Farm owner updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};


// Delete a farm owner
export const deleteFarmOwner = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM farm_owner WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Farm owner not found" });
    }

    res.status(200).json({ message: "Farm owner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
