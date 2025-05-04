import db from "../../config/dbconfig.js";
import jwt from "jsonwebtoken";

export const getTasksForWorker = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const workerId = decoded.id; // Ensure token stores farm_worker `w_id` as `id`

    const [tasks] = await db.query(
        `SELECT 
          t.id, t.pond_id, t.tk_id, t.description, t.status, t.due_date,
          p.name AS pond_name,
          tc.Task_type AS task_type
         FROM task t
         JOIN pond p ON t.pond_id = p.id
         JOIN task_category tc ON t.tk_id = tc.id
         WHERE t.assigned_to = ?`,
        [workerId]
      );
      
      

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching worker tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const markTaskAsCompleted = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
      }
  
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRET); // Optional: you can use it to ensure auth
  
      const { taskId } = req.params;
  
      const [result] = await db.query(
        `UPDATE task SET status = 'Completed' WHERE id = ?`,
        [taskId]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.status(200).json({ message: "Task marked as completed" });
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
