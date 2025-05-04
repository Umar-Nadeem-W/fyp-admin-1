import db from "../../config/dbconfig.js";



export const addPond = async (req, res) => {
    const { farmId } = req.params;
    const {  name, type, length, width, depth } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token

   

    if (!farmId || !name || !type || !length || !width || !depth) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Validate pond type
    const validTypes = ["Clay", "Concrete"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid pond type. Choose 'Clay' or 'Concrete'." });
    }

    try {
       
        // Insert new pond
        const [result] = await db.query(
            `INSERT INTO pond (farm_id, name, type, length, width, depth, status) 
             VALUES (?, ?, ?, ?, ?, ?, 'Stable')`,
            [farmId, name, type, length, width, depth]
        );

        // Update number_of_ponds in farm table
        await db.query(`UPDATE farm SET number_of_ponds = number_of_ponds + 1 WHERE id = ?`, [farmId]);

        res.status(201).json({ message: "Pond added successfully.", pondId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const editPond = async (req, res) => {
    const { pondId } = req.params;
    const { name, type, length, width, depth } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token


    if (!pondId || !name || !type || !length || !width || !depth) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Validate pond type
    const validTypes = ["Clay", "Concrete"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid pond type. Choose 'Clay' or 'Concrete'." });
    }

    try {

        // Update pond details
        await db.query(
            `UPDATE pond 
             SET name = ?, type = ?, length = ?, width = ?, depth = ? 
             WHERE id = ?`,
            [name, type, length, width, depth, pondId]
        );

        res.status(200).json({ message: "Pond updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getPond = async (req, res) => {
    const { farmId } = req.params;
    const farmOwnerId = req.user.farmOwnerId;
  
    try {
      const [ponds] = await db.query(
        `SELECT * FROM pond WHERE farm_id = ? AND farm_id IN (SELECT id FROM farm WHERE owner_id = ?)`,
        [farmId, farmOwnerId]
      );
  
      res.status(200).json(ponds);
    } catch (error) {
      console.error("Error fetching ponds by farm:", error);
      res.status(500).json({ error: "Server error while fetching ponds" });
    }
  };
  
  export const getPondsByFarm = async (req, res) => {
    const { farmId } = req.params;
    const farmOwnerId = req.user.farmOwnerId; // assuming this is added in your verifyToken middleware
  
    if (!farmId) {
      return res.status(400).json({ error: "Farm ID is required." });
    }
  
    try {
      // Ensure the farm belongs to the logged-in farm owner
      const [farmCheck] = await db.query(
        "SELECT * FROM farm WHERE id = ? AND owner_id = ?",
        [farmId, farmOwnerId]
      );
  
      if (farmCheck.length === 0) {
        return res.status(403).json({ error: "Unauthorized to access this farm's ponds." });
      }
  
      // Fetch all ponds associated with the farm
      const [ponds] = await db.query(
        "SELECT * FROM pond WHERE farm_id = ?",
        [farmId]
      );
  
      res.status(200).json(ponds);
    } catch (error) {
      console.error("Error fetching ponds:", error);
      res.status(500).json({ error: "Server error while fetching ponds" });
    }
  };

  export const getAllPonds = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId;
  
    try {
      const [ponds] = await db.query(
        `
        SELECT p.id, p.name 
        FROM pond p
        JOIN farm f ON p.farm_id = f.id
        WHERE f.owner_id = ?
        `,
        [farmOwnerId]
      );
  
      res.status(200).json(ponds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };
  
  

export const deletePond = async (req, res) => {
    const { pondId } = req.params;
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token
    const farmId = req.user.farmId;
  

    try {
       
       
        await db.query(`DELETE FROM pond WHERE id = ?`, [pondId]);

        // Decrease number_of_ponds in the farm table
        await db.query(`UPDATE farm SET number_of_ponds = number_of_ponds - 1 WHERE id = ?`, [farmId]);

        res.status(200).json({ message: "Pond deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
