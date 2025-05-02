// backend/controllers/packagesController.js
import db from "../../config/dbconfig.js";

export const getAllPackages = async (req, res) => {
  try {
    const [packages] = await db.query("SELECT * FROM packages");

    if (packages.length === 0) {
      return res.status(404).json({ message: "No packages found" });
    }

    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Server error while fetching packages" });
  }
};
