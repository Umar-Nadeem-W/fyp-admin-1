import db from "../config/dbconfig.js";

// Middleware to verify that user is an Employee
export const verifyEmployee = (req, res, next) => {
    if (req.user.role !== 2 || !req.user.employeeId) { // Assuming role 2 means Employee
        return res.status(403).json({ error: "Access denied. Employees only." });
    }
    next();
};

export const verifyFarmAccess = async (req, res, next) => {
    const farmId = req.body.farmId || req.params.farmId; // Get farmId from body or params
    const { farmOwnerId, role } = req.user; // Extracted from token

    if (!farmId) {
        return res.status(400).json({ error: "Farm ID is required." });
    }

    try {
        if (role === "employee") {
            // If user is employee, just check if farm exists
            const [farm] = await db.query(`SELECT id FROM farm WHERE id = ?`, [farmId]);

            if (!farm.length) {
                return res.status(404).json({ error: "Farm not found." });
            }
            next(); // Farm exists, employee allowed to view
        } else if (role === "farm_owner") {
            // If user is farm owner, must check ownership
            const [farm] = await db.query(
                `SELECT id FROM farm WHERE id = ? AND owner_id = ?`,
                [farmId, farmOwnerId]
            );

            if (!farm.length) {
                return res.status(403).json({ error: "Unauthorized. This farm does not belong to you." });
            }
            next(); // Owner authorized
        } else {
            return res.status(403).json({ error: "Access denied. Unauthorized role." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Middleware to verify Task Ownership for Employee
export const verifyEmployeeTaskOwnership = async (req, res, next) => {
    const taskId = req.params.taskId || req.body.taskId;
    const employeeId = req.user.employeeId;

    if (!employeeId) {
        return res.status(403).json({ error: "Access denied. Employees only." });
    }

    if (!taskId) {
        return res.status(400).json({ error: "Task ID is required." });
    }

    try {
        const [task] = await db.query(
            `SELECT t.id
             FROM task t
             JOIN farm_worker fw ON t.assigned_to = fw.w_id
             WHERE t.id = ? AND fw.e_id = ?`,
            [taskId, employeeId]
        );

        if (task.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This task does not belong to you." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Middleware to verify Expense created by Employee
export const verifyEmployeeExpenseOwnership = async (req, res, next) => {
    const expenseId = req.params.expenseId || req.body.expenseId;
    const employeeId = req.user.employeeId;

    if (!employeeId) {
        return res.status(403).json({ error: "Access denied. Employees only." });
    }

    if (!expenseId) {
        return res.status(400).json({ error: "Expense ID is required." });
    }

    try {
        const [expense] = await db.query(
            `SELECT id
             FROM expense
             WHERE id = ? AND created_by_employee = ?`, // Assuming you have a field like this
            [expenseId, employeeId]
        );

        if (expense.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This expense does not belong to you." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

// Middleware to verify Device assigned to Employee (Optional)
export const verifyEmployeeDeviceAccess = async (req, res, next) => {
    const deviceId = req.params.deviceId || req.body.deviceId;
    const employeeId = req.user.employeeId;

    if (!employeeId) {
        return res.status(403).json({ error: "Access denied. Employees only." });
    }

    if (!deviceId) {
        return res.status(400).json({ error: "Device ID is required." });
    }

    try {
        const [device] = await db.query(
            `SELECT d.id
             FROM devices d
             JOIN farm_worker fw ON d.assigned_worker_id = fw.w_id
             WHERE d.id = ? AND fw.e_id = ?`,
            [deviceId, employeeId]
        );

        if (device.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This device is not assigned to you." });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
