import db from "../../config/dbconfig.js";

export const getWorkerDevices = async (req, res) => {
  const u_id = req.user.id;

  try {
    const [rows] = await db.query(
      `SELECT 
         p.id AS pond_id,
         p.name AS pond_name,
         d.id AS device_id,
         d.name AS device_name,
         d.type AS device_type,
         d.sensors,
         i.installation_date
       FROM farm_worker fw
       JOIN pond p ON fw.farm_id = p.farm_id
       JOIN installations i ON p.id = i.pond_id
       JOIN devices d ON i.device_id = d.id
       WHERE fw.u_id = ? AND fw.status = 'Active'`,
      [u_id]
    );

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching worker devices:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
