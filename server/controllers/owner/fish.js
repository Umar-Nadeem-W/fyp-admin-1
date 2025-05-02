import db from "../../config/dbconfig.js"; // Import database connection

// Update fish stocking record
export const updateFishStocking = async (req, res) => {
  try {
    const { stockId } = req.params;
    const { fish_id, quantity } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // From token

    if (!fish_id || !quantity) {
      return res.status(400).json({ message: "Fish ID and quantity are required." });
    }

    // Authorization: Check if this record belongs to the owner
    const [rows] = await db.query(
      `SELECT fs.id
       FROM fish_stocking fs
       JOIN pond p ON fs.pond_id = p.id
       JOIN farm f ON p.farm_id = f.id
       WHERE fs.id = ? AND f.owner_id = ?`,
      [stockId, farmOwnerId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "You are not authorized to update this record." });
    }

    // Update fish_id and quantity
    await db.query(
      `UPDATE fish_stocking 
       SET fish_id = ?, quantity = ?
       WHERE id = ?`,
      [fish_id, quantity, stockId]
    );

    res.status(200).json({ message: "Fish stock updated successfully." });
  } catch (error) {
    console.error("Error updating fish stock:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const getAllFish = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, species, average_lifespan, optimal_temperature, optimal_ph, optimal_turbidity, optimal_dissolved_oxygen
      FROM fish
      ORDER BY species ASC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching fish species:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


// Create new fish stocking entry
export const addFishStocking = async (req, res) => {
  try {
    const { pondId, fish_id, quantity, date_of_stocking, age_at_stocking } = req.body;

    if (!pondId || !fish_id || !quantity || !date_of_stocking || !age_at_stocking) {
      return res.status(400).json({ message: "All fields are required." });
    }

    await db.query(
      `INSERT INTO fish_stocking (pond_id, fish_id, quantity, date_of_stocking, age_at_stocking)
       VALUES (?, ?, ?, ?, ?)`,
      [pondId, fish_id, quantity, date_of_stocking, age_at_stocking]
    );

    res.status(201).json({ message: "Fish stocked successfully." });
  } catch (err) {
    console.error("Error adding fish stocking:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all fish stocking records
export const getAllFishStockings = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT fs.*, p.name as pond_name, f.species as fish_species
      FROM fish_stocking fs
      JOIN pond p ON fs.pond_id = p.id
      JOIN fish f ON fs.fish_id = f.id
      ORDER BY fs.date_of_stocking DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching fish stocking records:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get fish stocking by pond
export const getStockingByPond = async (req, res) => {
  try {
    const { pondId } = req.params;

    const [rows] = await db.query(`
      SELECT fs.*, f.species as fish_species
      FROM fish_stocking fs
      JOIN fish f ON fs.fish_id = f.id
      WHERE fs.pond_id = ?
      ORDER BY fs.date_of_stocking DESC
    `, [pondId]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching pond fish stocking:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};



// Delete a fish stocking record
export const deleteFishStocking = async (req, res) => {
  try {
    const  id  = req.params.stockId;
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    // Check if the fish stocking record belongs to the correct farm owner
    const [rows] = await db.query(
      `SELECT fs.id
       FROM fish_stocking fs
       JOIN pond p ON fs.pond_id = p.id
       JOIN farm f ON p.farm_id = f.id
       WHERE fs.id = ? AND f.owner_id = ?`,
      [id, farmOwnerId]
    );

    // If no matching record is found, deny access
    if (rows.length === 0) {
      return res.status(403).json({ message: "You are not authorized to delete this record." });
    }

    // Proceed with deleting the fish stocking record
    await db.query(`DELETE FROM fish_stocking WHERE id = ?`, [id]);

    res.status(200).json({ message: "Fish stocking record deleted successfully." });
  } catch (err) {
    console.error("Error deleting fish stocking record:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

