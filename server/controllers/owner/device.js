import db from "../../config/dbconfig.js";

// Create a new device
export const createDevice = async (req, res) => {
    const { name, type, manufacturer, model, read_key, write_key, serial_number, status, sensors } = req.body;
    const createdBy = req.user.farmOwnerId; // Extract user ID from token

    try {
        const [result] = await db.query(
            `INSERT INTO devices (name, type, manufacturer, model, created_by, read_key, write_key, serial_number, status, sensors)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, type, manufacturer, model, createdBy, read_key, write_key, serial_number, status || 'Active', JSON.stringify(sensors)]
        );

        res.status(201).json({ message: "Device created successfully", deviceId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get all devices
export const getDevices = async (req, res) => {
    const farmOwnerId=req.user.farmOwnerId;  

    try {
        const [devices] = await db.query(`SELECT * FROM devices where created_by=?`,[farmOwnerId]);
        res.status(200).json(devices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Get a single device by ID
export const getDeviceById = async (req, res) => {
    const { deviceId } = req.params;
    try {
        const [device] = await db.query(`SELECT * FROM devices WHERE id = ?`, [deviceId]);
        if (device.length === 0) {
            return res.status(404).json({ error: "Device not found" });
        }
        res.status(200).json(device[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Update a device
export const updateDevice = async (req, res) => {
    const { deviceId } = req.params;
    const { name, type, manufacturer, model, read_key, write_key, serial_number, status, sensors } = req.body;
    try {
        const [result] = await db.query(
            `UPDATE devices SET name = ?, type = ?, manufacturer = ?, model = ?, read_key = ?, write_key = ?, serial_number = ?, status = ?, sensors = ? WHERE id = ?`,
            [name, type, manufacturer, model, read_key, write_key, serial_number, status, JSON.stringify(sensors), deviceId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Device not found" });
        }
        res.status(200).json({ message: "Device updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete a device
// Delete a device
export const deleteDevice = async (req, res) => {
    const { deviceId } = req.params;

    try {
        // Step 1: Remove linked installations first (to prevent FK constraint errors)
        await db.query(`DELETE FROM installations WHERE device_id = ?`, [deviceId]);

        // Step 2: Delete the device
        const [result] = await db.query(`DELETE FROM devices WHERE id = ?`, [deviceId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Device not found" });
        }

        res.status(200).json({ message: "Device deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

