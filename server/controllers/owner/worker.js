import db from "../../config/dbconfig.js";

// Add a worker to a farm
export const addFarmWorker = async (req, res) => {
    const { farmId, email, designation, manageTransactions } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!farmId || !email) {
        return res.status(400).json({ error: "Farm ID and Email are required." });
    }

    try {
        // Get user ID from email
        const [user] = await db.query(
            `SELECT id FROM user WHERE email = ?`,
            [email]
        );

        if (!user.length) {
            return res.status(404).json({ error: "User with this email does not exist." });
        }

        const userId = user[0].id;

        // Check if the user is already an active worker in any farm
        const [existingWorkerStatus] = await db.query(
            `SELECT w_id FROM farm_worker WHERE u_id = ? AND status = 'Active'`,
            [userId]
        );

        if (existingWorkerStatus.length) {
            return res.status(400).json({ error: "User is already an active worker in another farm." });
        }

        // Add the worker to the farm with 'Active' status
        await db.query(
            `INSERT INTO farm_worker (farm_id, u_id, designation, manage_transactions, status) VALUES (?, ?, ?, ?, 'Active')`,
            [farmId, userId, designation || "Worker", manageTransactions || false]
        );

        await db.query(
            `UPDATE farm SET number_of_workers = number_of_workers + 1 WHERE id = ?`,
            [farmId]
        );

        res.status(201).json({ message: "Worker added to the farm successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const removeFarmWorkerById = async (req, res) => {
    const workerId = req.params.workerId;
    const farmOwnerId = req.user.farmOwnerId;

    if (!workerId) {
        return res.status(400).json({ error: "Worker ID is required." });
    }

    try {
        // 1. Find farm ID for decrementing workers later
        const [worker] = await db.query(
            `SELECT farm_id FROM farm_worker WHERE w_id = ?`,
            [workerId]
        );

        if (!worker.length) {
            return res.status(404).json({ error: "Worker not found." });
        }

        const farmId = worker[0].farm_id;

        // 2. Delete all tasks assigned to this worker
        await db.query(
            `DELETE FROM task WHERE assigned_to = ?`,
            [workerId]
        );

        // 3. Delete all routine task configs assigned to this worker
        await db.query(
            `DELETE FROM routine_task_config WHERE assigned_to = ?`,
            [workerId]
        );

        // 4. Now delete the worker safely
        await db.query(
            `DELETE FROM farm_worker WHERE w_id = ?`,
            [workerId]
        );

        // 5. Decrement worker count in farm
        await db.query(
            `UPDATE farm SET number_of_workers = number_of_workers - 1 WHERE id = ?`,
            [farmId]
        );

        res.status(200).json({ message: "Worker removed successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};




export const getAllWorkersOfFarmOwner = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId;

    try {
        const [workers] = await db.query(
            `SELECT 
                fw.w_id,
                fw.farm_id,
                f.name AS farm_name,
                u.id AS user_id,
                u.user_name,
                u.email,
                u.gender,
                u.image,
                fw.designation,
                fw.status,
                fw.manage_transactions
            FROM farm_worker fw
            JOIN farm f ON fw.farm_id = f.id
            JOIN farm_owner fo ON f.owner_id = fo.id
            JOIN user u ON fw.u_id = u.id
            WHERE fo.id = ?`,
            [farmOwnerId]
        );

        res.status(200).json(workers);
    } catch (error) {
        console.error("Error fetching workers:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getAllFarmWorkers = async (req, res) => {
    const farmId = req.params.farmId;
    const farmOwnerId = req.user.farmOwnerId;

    if (!farmId) {
        return res.status(400).json({ error: "Farm ID is required." });
    }

    try {
        // Fetch workers assigned to the farm
        const [workers] = await db.query(
            `SELECT fw.w_id, u.id as userId, u.user_name AS name, u.email, fw.designation, fw.manage_transactions, fw.status
             FROM farm_worker fw
             JOIN user u ON fw.u_id = u.id
             WHERE fw.farm_id = ?`,
            [farmId]
        );
        

        res.status(200).json(workers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const getFarmWorkerById = async (req, res) => {
    const workerId = req.params.workerId;
    const farmOwnerId = req.user.farmOwnerId;

    if (!workerId) {
        return res.status(400).json({ error: "Worker ID is required." });
    }

    try {
        const [worker] = await db.query(
            `SELECT fw.w_id, u.id as userId, u.user_name AS name, u.email, fw.designation, fw.manage_transactions, fw.status, f.id as farmId
             FROM farm_worker fw
             JOIN user u ON fw.u_id = u.id
             JOIN farm f ON fw.farm_id = f.id
             WHERE fw.w_id = ?`,
            [workerId]
        );
        
        

        res.status(200).json(worker[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const updateFarmWorkerById = async (req, res) => {
    const workerId = req.params.workerId;
    const farmOwnerId = req.user.farmOwnerId;
    const { designation, manageTransactions, status } = req.body;

    if (!workerId) {
        return res.status(400).json({ error: "Worker ID is required." });
    }

    try {
       
        await db.query(
            `UPDATE farm_worker 
             SET designation = ?, manage_transactions = ?
             WHERE w_id = ?`,
            [designation, manageTransactions, workerId]
        );

        res.status(200).json({ message: "Worker updated successfully." });
    } catch (error) {
        console.error("Error updating worker:", error);
        res.status(500).json({ error: "Server error" });
    }
};
