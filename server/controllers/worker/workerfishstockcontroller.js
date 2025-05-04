// controllers/fishStockController.js
import db from "../../config/dbconfig.js";

// GET fish stock data for the worker's assigned farm
export const getFishStockForWorker = async (req, res) => {
  const userId = req.user.id; // assuming token middleware sets req.user

  try {
    // Step 1: Get the farm_id for this user from farm_worker table
    const [farmWorker] = await db.query(
      "SELECT farm_id FROM farm_worker WHERE u_id = ?",
      [userId]
    );

    if (farmWorker.length === 0) {
      return res.status(404).json({ message: "Farm not assigned to worker" });
    }

    const farmId = farmWorker[0].farm_id;

    // Step 2: Get all ponds under this farm
    const [ponds] = await db.query("SELECT id FROM pond WHERE farm_id = ?", [farmId]);
    const pondIds = ponds.map((pond) => pond.id);

    if (pondIds.length === 0) {
      return res.status(404).json({ message: "No ponds found for this farm" });
    }

    // Step 3: Get fish stock data for those pond IDs
    const [fishStock] = await db.query(
      `SELECT fs.id, fs.pond_id, fs.fish_id, f.species, fs.quantity,
              fs.date_of_stocking, fs.age_at_stocking
       FROM fish_stocking fs
       JOIN fish f ON fs.fish_id = f.id
       WHERE fs.pond_id IN (?)`,
      [pondIds]
    );

    res.status(200).json(fishStock);
  } catch (err) {
    console.error("Error fetching fish stock:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
