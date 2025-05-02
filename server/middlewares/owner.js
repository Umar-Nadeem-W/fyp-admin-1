import db from "../config/dbconfig.js";

export const verifyOwner = (req, res, next) => {
    if (req.user.role !== 4 || !req.user.farmOwnerId) {
        return res.status(408).json({ error: "Access denied. Farm Owners only." });
    }
    next();
  };
  

  export const verifyFarmOwnership = async (req, res, next) => {
    const farmId = req.body.farmId || req.params.farmId; // Get farmId from body or params
    const farmOwnerId = req.user.farmOwnerId; // Extracted from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can perform this action." });
    }

    if (!farmId) {
        return res.status(400).json({ error: "Farm ID is required." });
    }

    try {
        // Check if the farm belongs to the logged-in farm owner
        const [farm] = await db.query(
            `SELECT id FROM farm WHERE id = ? AND owner_id = ?`,
            [farmId, farmOwnerId]
        );

        if (!farm.length) {
            return res.status(403).json({ error: "Unauthorized. This farm does not belong to you." });
        }

        next(); // Farm belongs to the owner, proceed to the next middleware/controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const verifyPondOwnership = async (req, res, next) => {
    const pondId = req.body.pondId || req.params.pondId; // Get farmId from body or params
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can access this resource." });
    }

    if (!pondId) {
        return res.status(400).json({ error: "Pond ID is required." });
    }

    try {
        // Check if the pond exists and belongs to a farm owned by the user
        const [pond] = await db.query(
            `SELECT p.id FROM pond p 
             JOIN farm f ON p.farm_id = f.id 
             WHERE p.id = ? AND f.owner_id = ?`,
            [pondId, farmOwnerId]
        );

        if (pond.length === 0) {
            return res.status(403).json({ error: "Unauthorized access. Pond not found or does not belong to you." });
        }
        const farmId = pond[0].farm_id;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};




export const verifyDeviceOwnership = async (req, res, next) => {
    const  deviceId  = req.params.deviceId || req.body.deviceId ; // Device ID from request parameters
    const farmOwnerId = req.user.farmOwnerId; // Extract farmOwnerId from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can perform this action." });
    }
    if(!deviceId){
        return res.status(400).json({ error: "Device ID is required." });
    }

    try {
        const [device] = await db.query(`SELECT created_by FROM devices WHERE id = ?`, [deviceId]);

        if (device.length === 0) {
            return res.status(404).json({ error: "Device not found" });
        }

        // Verify that the farm_owner_id in the token matches the created_by in the devices table
        if (device[0].created_by !== farmOwnerId) {
            return res.status(403).json({ error: "Unauthorized. You do not have permission to access this device." });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const verifyWorkerOwnership = async (req, res, next) => {
    const  workerId  = req.params.workerId || req.body.workerId; // Extract worker ID from request parameters
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!workerId) {
        return res.status(400).json({ error: "Worker ID is required." });
    }

    try {
        // Check if the worker belongs to a farm owned by the authenticated farm owner
        const [worker] = await db.query(
            `SELECT fw.w_id FROM farm_worker fw
             JOIN farm f ON fw.farm_id = f.id
             WHERE fw.w_id = ? AND f.owner_id = ?`,
            [workerId, farmOwnerId]
        );

        if (!worker.length) {
            return res.status(403).json({ error: "Unauthorized. Worker does not belong to your farm." });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const verifyInstallationOwnership = async (req, res, next) => {
    const installationId = req.params.installationId || req.body.installationId;
    const farmOwnerId = req.user.farmOwnerId;

    if (!installationId) {
        return res.status(400).json({ error: "Installation ID is required." });
    }

    try {
        const [installation] = await db.query(
            `SELECT id FROM installations WHERE id = ? AND installed_by = ?`,
            [installationId, farmOwnerId]
        );

        if (!installation.length) {
            return res.status(403).json({ error: "Unauthorized. This installation does not belong to you." });
        }

        next(); // Installation belongs to the farm owner
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};









export const verifyTaskCategoryOwnership = async (req, res, next) => {
    const  taskCategoryId  = req.params.taskCategoryId || req.body.taskCategoryId; // Extract the task category ID from the request parameters
    const farmOwnerId = req.user.farmOwnerId; // Extract the farm owner ID from the token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can access this resource." });
    }

    if (!taskCategoryId) {
        return res.status(400).json({ error: "Task category ID is required." });
    }

    try {
        // Check if the task category belongs to the farm owner
        const [taskCategory] = await db.query(
            `SELECT id FROM task_category WHERE id = ? AND owner_id = ?`,
            [taskCategoryId, farmOwnerId]
        );

        if (taskCategory.length === 0) {
            return res.status(403).json({ error: "Unauthorized. Task category does not belong to you." });
        }

        // Task category belongs to the owner, proceed to the next middleware/controller
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};





export const verifyTaskOwnership = async (req, res, next) => {
    const taskId = req.params.taskId || req.body.taskId; // Extract task ID from request parameters or body
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can access this resource." });
    }

    if (!taskId) {
        return res.status(400).json({ error: "Task ID is required." });
    }

    try {
        // Check if the task belongs to a farm owned by the authenticated farm owner
        const [task] = await db.query(
            `SELECT t.id 
             FROM task t
             JOIN task_category tc ON t.tk_id = tc.id
             WHERE t.id = ? AND tc.owner_id = ?`,
            [taskId, farmOwnerId]
        );

        if (task.length === 0) {
            return res.status(403).json({ error: "Unauthorized. Task does not belong to your farm." });
        }

        next(); // Task belongs to the owner, proceed to the next middleware/controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const verifyExpenseOwnership = async (req, res, next) => {
    const expenseId = req.params.expenseId || req.body.expenseId; // Get expense ID from params or body
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can access this resource." });
    }

    if (!expenseId) {
        return res.status(400).json({ error: "Expense ID is required." });
    }

    try {
        // Check if the expense belongs to a farm owned by this farm owner
        const [expense] = await db.query(
            `SELECT e.serial_number 
             FROM expense e
             JOIN farm f ON e.farm_id = f.id
             WHERE e.serial_number = ? AND f.owner_id = ?`,
            [expenseId, farmOwnerId]
        );

        if (expense.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This expense does not belong to your farm." });
        }

        next(); // Expense belongs to the farm owner
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



//middlewre to verify subscription ownership
export const verifySubscriptionOwnership = async (req, res, next) => {
    const subscriptionId = req.params.subscriptionId || req.body.subscriptionId; // Extract subscription ID from request parameters or body
    const farmOwnerId = req.user.farmOwnerId; // Extract farm owner ID from token

    if (!farmOwnerId) {
        return res.status(403).json({ error: "Access denied. Only farm owners can access this resource." });
    }

    if (!subscriptionId) {
        return res.status(400).json({ error: "Subscription ID is required." });
    }

    try {
        // Check if the subscription belongs to the farm owner
        const [subscription] = await db.query(
            `SELECT id FROM subscription WHERE id = ? AND subscriber_id = ?`,
            [subscriptionId, farmOwnerId]
        );

        if (subscription.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This subscription does not belong to you." });
        }

        next(); // Subscription belongs to the owner, proceed to the next middleware/controller
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};