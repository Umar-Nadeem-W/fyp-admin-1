import db from "../../config/dbconfig.js";

// GET /api/packages - Public or Authenticated Endpoint
export const getAllPackages = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM packages");

    return res.status(200).json({ packages: rows });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return res.status(500).json({ error: "Failed to fetch subscription packages." });
  }
};
