import db from "../../config/dbconfig.js";

export const getFarms = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId; 
    const role = req.user.role; 

    try {
        let farms;

        if (role === 2) { // Employee
            const [allFarms] = await db.query("SELECT * FROM farm");
            farms = allFarms;
        } else if (role === 4) { // Farm Owner
            const [ownerFarms] = await db.query(
                "SELECT * FROM farm WHERE owner_id = ?",
                [farmOwnerId]
            );
            farms = ownerFarms;
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        res.status(200).json({ farms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getFarmById = async (req, res) => {
    const { farmId } = req.params;
    const farmOwnerId = req.user.farmOwnerId;
    const role = req.user.role;

    try {
        let farm;

        if (role === 2) { // Employee
            const [result] = await db.query(
                "SELECT * FROM farm WHERE id = ?",
                [farmId]
            );
            farm = result;
        } else if (role === 4) { // Farm Owner
            const [result] = await db.query(
                "SELECT * FROM farm WHERE id = ? AND owner_id = ?",
                [farmId, farmOwnerId]
            );
            farm = result;
        } else {
            return res.status(403).json({ error: "Unauthorized role." });
        }

        if (!farm.length) {
            return res.status(404).json({ error: "Farm not found." });
        }

        res.status(200).json({ farm: farm[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
