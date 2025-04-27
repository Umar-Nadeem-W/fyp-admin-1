import db from "../../config/dbconfig.js";

export const createTaskCategory = async (req, res) => {
    const { task_category, task_type, task_type_description, recurrence_interval_hours, workerId, completion_window_minutes } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Insert task category into task_category table
        const [result] = await db.query(
            `INSERT INTO task_category (owner_id, task_category, task_type, task_type_description)
             VALUES (?, ?, ?, ?)`,
            [farmOwnerId, task_category, task_type, task_type_description]
        );

        // Check if the task category is 'Routine'
        if (task_category === 'Routine') {
            // Insert data into routine_task_config table
            const [configResult] = await db.query(
                `INSERT INTO routine_task_config (task_category_id, recurrence_interval_hours, assigned_to, completion_window_minutes)
                 VALUES (?, ?, ?, ?)`,
                [result.insertId, recurrence_interval_hours, workerId, completion_window_minutes]
            );
        }

        res.status(201).json({ message: "Task category created successfully", categoryId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


export const assignTask = async (req, res) => {
  try {
    const { task_id, worker_id, pond_id } = req.body;

    // Validate inputs
    if (!task_id || !pond_id || !worker_id) {
      return res.status(400).json({ error: "task_id, pond_id, and worker_id are required" });
    }

    // ✅ Confirm task exists
    const [task] = await db.query("SELECT * FROM tasks WHERE id = ?", [task_id]);
    if (task.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    // ✅ Confirm pond exists
    const [pond] = await db.query("SELECT * FROM pond WHERE id = ?", [pond_id]);
    if (pond.length === 0) {
      return res.status(404).json({ error: "Pond not found" });
    }

    // ✅ Confirm worker exists
    const [worker] = await db.query("SELECT * FROM worker WHERE id = ?", [worker_id]);
    if (worker.length === 0) {
      return res.status(404).json({ error: "Worker not found" });
    }

    // ✅ Assign task to worker and pond
    const updateQuery = `
      UPDATE tasks 
      SET pond_id = ?, assigned_to = ?, status = 'In Progress'
      WHERE id = ?
    `;
    await db.query(updateQuery, [pond_id, worker_id, task_id]);

    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error("Assign Task Error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};


export const getTaskCategoryById = async (req, res) => {
    const { taskCategoryId } = req.params;  // Extract task category ID from request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Retrieve task category by ID, along with its routine task config if it is of type 'Routine'
        const [category] = await db.query(
            `SELECT tc.id, tc.task_category, tc.task_type, tc.task_type_description,
                    rtc.recurrence_interval_hours, rtc.assigned_to, rtc.completion_window_minutes
             FROM task_category tc
             LEFT JOIN routine_task_config rtc ON tc.id = rtc.task_category_id
             WHERE tc.id = ? AND tc.owner_id = ?`,
            [taskCategoryId, farmOwnerId]
        );

        if (!category.length) {
            return res.status(404).json({ error: "Task category not found or does not belong to you." });
        }

        res.status(200).json({ category: category[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};




export const getAllTaskCategories = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Retrieve task categories along with their routine task config if they are of type 'Routine'
        const [categories] = await db.query(
            `SELECT tc.id, tc.task_category, tc.task_type, tc.task_type_description,
                    rtc.recurrence_interval_hours, rtc.assigned_to, rtc.completion_window_minutes
             FROM task_category tc
             LEFT JOIN routine_task_config rtc ON tc.id = rtc.task_category_id
             WHERE tc.owner_id = ?`,
            [farmOwnerId]
        );

        if (!categories.length) {
            return res.status(404).json({ error: "No task categories found." });
        }

        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const updateTaskCategory = async (req, res) => {
    const { task_category, task_type, task_type_description, recurrence_interval_hours, workerId, completion_window_minutes } = req.body;
    const { taskCategoryId } = req.params;  // Extract task category ID from request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Update task category in task_category table
        await db.query(
            `UPDATE task_category
             SET task_category = ?, task_type = ?, task_type_description = ?
             WHERE id = ?`,
            [task_category, task_type, task_type_description, taskCategoryId]
        );

        // If the task category is 'Routine', update routine_task_config table as well
        if (task_category === 'Routine') {
            // Check if a corresponding entry exists in the routine_task_config table
            const [config] = await db.query(
                `SELECT * FROM routine_task_config WHERE task_category_id = ?`,
                [taskCategoryId]
            );

            if (config.length > 0) {
                // Update the existing routine task configuration
                await db.query(
                    `UPDATE routine_task_config
                     SET recurrence_interval_hours = ?, assigned_to = ?, completion_window_minutes = ?
                     WHERE task_category_id = ?`,
                    [recurrence_interval_hours, workerId, completion_window_minutes, taskCategoryId]
                );
            } else {
                // If no existing config, insert a new routine task config
                await db.query(
                    `INSERT INTO routine_task_config (task_category_id, recurrence_interval_hours, assigned_to, completion_window_minutes)
                     VALUES (?, ?, ?, ?)`,
                    [taskCategoryId, recurrence_interval_hours, assigned_to, completion_window_minutes]
                );
            }
        }

        res.status(200).json({ message: "Task category updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};






export const deleteTaskCategory = async (req, res) => {
    const { taskCategoryId } = req.params; // Extract task category ID from request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Check if the task category exists and belongs to the farm owner
        const [taskCategory] = await db.query(
            `SELECT * FROM task_category WHERE id = ? AND owner_id = ?`,
            [taskCategoryId, farmOwnerId]
        );

        if (taskCategory.length === 0) {
            return res.status(403).json({ error: "Unauthorized. This task category does not belong to you." });
        }

        // If the task category is 'Routine', delete the corresponding entry in the routine_task_config table
        if (taskCategory[0].task_category === 'Routine') {
            await db.query(
                `DELETE FROM routine_task_config WHERE task_category_id = ?`,
                [taskCategoryId]
            );
        }

        // Delete task category from the task_category table
        await db.query(
            `DELETE FROM task_category WHERE id = ?`,
            [taskCategoryId]
        );

        res.status(200).json({ message: "Task category deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};










// Create a new task
export const createTask = async (req, res) => {
    const { pond_id, taskCategoryId, assigned_to, assigned_by, description, due_date } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Fetch task category details to check if it's a routine or non-routine task
        const [taskCategory] = await db.query(
            `SELECT * FROM task_category WHERE id = ?`,
            [taskCategoryId]
        );

        if (taskCategory.length === 0) {
            return res.status(400).json({ error: "Task category not found." });
        }

        // Validate that the due_date is provided for non-routine tasks
        if (taskCategory[0].Task_category !== 'Routine' && !due_date) {
            return res.status(400).json({ error: "Due date is required for non-routine tasks." });
        }

        // Convert due_date to MySQL-compatible format if it's in ISO format with 'Z'
        let finalDueDate = due_date;
        
        // If due_date contains a 'Z', remove it (UTC indicator) and format it to 'YYYY-MM-DD HH:MM:SS'
        if (finalDueDate && finalDueDate.includes('Z')) {
            finalDueDate = finalDueDate.replace('Z', '').replace('T', ' ');
        }

        // Create the task in the database for non-routine tasks
        const [result] = await db.query(
            `INSERT INTO task (pond_id, tk_id, assigned_to, assigned_by, description, status, due_date)
             VALUES (?, ?, ?, ?, ?, 'Pending', ?)`,
            [pond_id, taskCategoryId, assigned_to, assigned_by, description, finalDueDate]
        );

        res.status(201).json({ message: "Task created successfully", taskId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



// Get task by ID
export const getTaskById = async (req, res) => {
    const { taskId } = req.params;  // Extract task ID from request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Retrieve task by ID and its associated task category
        const [task] = await db.query(
            `SELECT t.id, t.pond_id, t.tk_id, t.assigned_to, t.assigned_by, t.description, t.status, t.due_date,
                    tc.task_category, tc.task_type, tc.task_type_description
             FROM task t
             LEFT JOIN task_category tc ON t.tk_id = tc.id
             WHERE t.id = ? AND tc.owner_id = ?`,
            [taskId, farmOwnerId]
        );

        if (!task.length) {
            return res.status(404).json({ error: "Task not found or does not belong to you." });
        }

        res.status(200).json({ task: task[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



// Get all tasks
export const getAllTasks = async (req, res) => {
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Retrieve all tasks and their associated task category details
        const [tasks] = await db.query(
            `SELECT t.id, t.pond_id, t.tk_id, t.assigned_to, t.assigned_by, t.description, t.status, t.due_date,
                    tc.task_category, tc.task_type, tc.task_type_description
             FROM task t
             LEFT JOIN task_category tc ON t.tk_id = tc.id
             WHERE tc.owner_id = ?`,
            [farmOwnerId]
        );

        if (!tasks.length) {
            return res.status(404).json({ error: "No tasks found." });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Get tasks by status
export const getTasksByStatus = async (req, res) => {
    const { status } = req.body;  // Extract status from the request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // Retrieve tasks filtered by the given status and associated task category details
        const [tasks] = await db.query(
            `SELECT t.id, t.pond_id, t.tk_id, t.assigned_to, t.assigned_by, t.description, t.status, t.due_date,
                    tc.task_category, tc.task_type, tc.task_type_description
             FROM task t
             LEFT JOIN task_category tc ON t.tk_id = tc.id
             WHERE tc.owner_id = ? AND t.status = ?`,
            [farmOwnerId, status]
        );

        if (!tasks.length) {
            return res.status(404).json({ error: `No tasks found with status ${status}.` });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Update a task's details (like status or description)
export const updateTask = async (req, res) => {
    const { taskId } = req.params;  // Extract task ID from request params
    const { description, status, due_date } = req.body;
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
        // If a due_date is provided, format it to MySQL-compatible format
        let finalDueDate = due_date;
        
        // If due_date contains a 'Z', remove it (UTC indicator) and format it to 'YYYY-MM-DD HH:MM:SS'
        if (finalDueDate && finalDueDate.includes('Z')) {
            finalDueDate = finalDueDate.replace('Z', '').replace('T', ' ');
        }

        // Perform the update query
        await db.query(
            `UPDATE task
             SET description = ?, status = ?, due_date = ?
             WHERE id = ?`,
            [description, status, finalDueDate, taskId]
        );

        res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};


// Delete a task
export const deleteTask = async (req, res) => {
    const { taskId } = req.params; // Extract task ID from request params
    const farmOwnerId = req.user.farmOwnerId; // Farm owner ID from the logged-in user

    try {
     
        // Delete the task
        await db.query(
            `DELETE FROM task WHERE id = ?`,
            [taskId]
        );

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
