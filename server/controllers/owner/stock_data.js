import db from "../../config/dbconfig.js"; // Import database connection

export const getPondData = async (req, res) => {
  try {
    const { pondName } = req.params; // Get pond name from request parameters

    if (!pondName) {
      return res.status(400).json({ message: "Pond name is required." });
    }

    // Step 1: Get the pond ID from the pond table
    const [pondRows] = await db.query(
      `SELECT id FROM pond WHERE name = ?`,
      [pondName]
    );

    if (pondRows.length === 0) {
      return res.status(404).json({ message: "Pond not found. kks" });
    }

    const pondId = pondRows[0].id;

    // Step 2: Get the installation ID from the installations table
    const [installationRows] = await db.query(
      `SELECT id FROM installations WHERE pond_id = ?`,
      [pondId]
    );

    if (installationRows.length === 0) {
      return res.status(404).json({ message: "No installations found for this pond." });
    }

    const installationId = installationRows[0].id;

    // Step 3: Get the pond data from the pond_data table
    // Step 3: Get the pond data from the pond_data table
const [pondDataRows] = await db.query(
    `SELECT ph, temp, turbidity, recorded_at FROM pond_data WHERE installation_id = ?`,
    [installationId]
  );
  

    if (pondDataRows.length === 0) {
      return res.status(404).json({ message: "No pond data found for this installation." });
    }

    res.status(200).json(pondDataRows);
  } catch (error) {
    console.error("Error fetching pond data:", error);
    res.status(500).json({ message: "Internal server error." });
 }
};
