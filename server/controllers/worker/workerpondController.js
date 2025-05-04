import db from "../../config/dbconfig.js";

export const getWorkerPonds = async (req, res) => {
    const u_id = req.user.id;
    try {
      const [rows] = await db.query(
        `SELECT p.*
         FROM pond p
         JOIN farm_worker fw ON fw.farm_id = p.farm_id
         WHERE fw.u_id = ? AND fw.status = 'Active'`,
        [u_id]
      );
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching ponds:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  