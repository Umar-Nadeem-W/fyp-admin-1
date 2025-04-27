import db from "../../config/dbconfig.js";

// Farm Owner adds a new farm
export const addFarm = async (req, res) => {
    const { name, address, city, state, country, zip } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can add farms." });
    }

    if (!name || !address || !city || !state || !country || !zip) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Insert new farm with 0 ponds and 0 workers initially
        const [result] = await db.query(
            `INSERT INTO farm (owner_id, name, address, city, state, country, zip) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [farmOwnerId, name, address, city, state, country, zip]
        );

        res.status(201).json({ message: "Farm added successfully.", farmId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const updateFarm = async (req, res) => {
    const { farmId } = req.params;
    const { name, address, city, state, country, zip } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token
    try {
        
        // Update farm details (only update provided fields)
        await db.query(
            `UPDATE farm SET 
                name = COALESCE(?, name), 
                address = COALESCE(?, address), 
                city = COALESCE(?, city), 
                state = COALESCE(?, state), 
                country = COALESCE(?, country), 
                zip = COALESCE(?, zip)
             WHERE id = ? AND owner_id = ?`,
            [name, address, city, state, country, zip, farmId, farmOwnerId]
        );

        res.status(200).json({ message: "Farm updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Read all farms for a specific farm owner
export const getFarms = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token

    try {
        const [farms] = await db.query(
            "SELECT * FROM farm WHERE owner_id = ?",
            [farmOwnerId]
        );

        res.status(200).json({ farms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const deleteFarm = async (req, res) => {
    const { farmId } = req.params; // Farm ID comes from the request body
    const farmOwnerId = req.user.farmOwnerId;


    try {
       
        // Delete all related data first (ponds, workers, etc.)
        await db.query("DELETE FROM pond WHERE farm_id = ?", [farmId]);
        await db.query("DELETE FROM farm_worker WHERE farm_id = ?", [farmId]);

        // Finally, delete the farm
        await db.query("DELETE FROM farm WHERE id = ?", [farmId]);

        res.status(200).json({ message: "Farm deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const getFarmById = async (req, res) => {
    const { farmId } = req.params;
    const farmOwnerId = req.user.farmOwnerId;


    try {
        const [farm] = await db.query(
            "SELECT * FROM farm WHERE id = ? AND owner_id = ?",
            [farmId, farmOwnerId]
        );

        if (farm.length === 0) {
            return res.status(404).json({ error: "Farm not found or unauthorized access." });
        }

        res.status(200).json({ farm: farm[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
