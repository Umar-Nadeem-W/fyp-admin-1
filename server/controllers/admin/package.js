import db from "../../config/dbconfig.js";

// Get all packages
export const getAllPackages = async (req, res) => {
  try {
    const [packages] = await db.execute(`SELECT * FROM packages`);
    res.status(200).json(packages);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Get a single package by ID
export const getPackageById = async (req, res) => {
  const { packageId } = req.params;
  try {
    const [rows] = await db.execute(`SELECT * FROM packages WHERE id = ?`, [packageId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Create a new package
export const createPackage = async (req, res) => {
  const { name, description, price, duration, max_sites, max_ponds, max_workers } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO packages (name, description, price, duration, max_sites, max_ponds, max_workers)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, duration, max_sites, max_ponds, max_workers]
    );

    res.status(201).json({ message: "Package created successfully", packageId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Update a package
export const updatePackage = async (req, res) => {
  const { packageId } = req.params;
  const { name, description, price, duration, max_sites, max_ponds, max_workers } = req.body;

  try {
    const [result] = await db.execute(
      `UPDATE packages
       SET name = ?, description = ?, price = ?, duration = ?, max_sites = ?, max_ponds = ?, max_workers = ?
       WHERE id = ?`,
      [name, description, price, duration, max_sites, max_ponds, max_workers, packageId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Package not found or no changes made" });
    }

    res.status(200).json({ message: "Package updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Delete a package
export const deletePackage = async (req, res) => {
  const { packageId } = req.params;

  try {
    const [result] = await db.execute(`DELETE FROM packages WHERE id = ?`, [packageId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};
