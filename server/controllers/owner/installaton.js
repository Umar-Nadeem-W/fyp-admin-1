import db from "../../config/dbconfig.js";

// Create a new installation
export const createInstallation = async (req, res) => {
    const { deviceId, pondId, installation_date, notes } = req.body;
    const installed_by = req.user.farmOwnerId; 

    try {
        // Check if the device is already installed
        const [deviceExists] = await db.query(
            `SELECT id FROM installations WHERE device_id = ?`,
            [deviceId]
        );
        if (deviceExists.length > 0) {
            return res.status(400).json({ error: "This device is already installed." });
        }

        // Check if the pond already has a device installed
        const [pondExists] = await db.query(
            `SELECT id FROM installations WHERE pond_id = ?`,
            [pondId]
        );
        if (pondExists.length > 0) {
            return res.status(400).json({ error: "This pond already has a device installed." });
        }

        // Proceed to create installation
        const [result] = await db.query(
            `INSERT INTO installations (device_id, pond_id, installed_by, installation_date, notes)
             VALUES (?, ?, ?, ?, ?)`,
            [deviceId, pondId, installed_by, installation_date, notes]
        );

        res.status(201).json({ message: "Installation created successfully", installationId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all installations created by a farm owner
export const getInstallations = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId;

    try {
        const [installations] = await db.query(`
            SELECT i.*, d.name AS device_name, p.name AS pond_name
            FROM installations i
            JOIN devices d ON i.device_id = d.id
            JOIN pond p ON i.pond_id = p.id
            WHERE i.installed_by = ?
            ORDER BY i.installation_date DESC
        `, [farmOwnerId]);

        res.status(200).json(installations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Get installation by ID
export const getInstallationById = async (req, res) => {
    const { installationId } = req.params;

    try {
        const [rows] = await db.query(`
            SELECT * FROM installations WHERE id = ?
        `, [installationId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Installation not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update installation
export const updateInstallation = async (req, res) => {
    const { installationId } = req.params;
    const { notes } = req.body;

    try {

        

        const [result] = await db.query(
            `UPDATE installations
             SET  notes = ?
             WHERE id = ?`,
            [ notes, installationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Installation not found" });
        }

        res.status(200).json({ message: "Installation updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Delete installation
export const deleteInstallation = async (req, res) => {
    const { installationId } = req.params;

    try {
        const [result] = await db.query(
            `DELETE FROM installations WHERE id = ?`,
            [installationId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Installation not found" });
        }

        res.status(200).json({ message: "Installation deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
