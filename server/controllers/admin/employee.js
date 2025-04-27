import db from "../../config/dbconfig.js";

// Approve an Employee and Assign Roles
export const approveEmployee = async (req, res) => {
    const { employeeId } = req.params;
    const { status, designation, manageDevices, sendAnnouncement, manageUsers, canSeeComplaints } = req.body;

    try {
        // Check if the employee exists
        const [employee] = await db.query("SELECT * FROM employee WHERE e_id = ?", [employeeId]);

        if (employee.length === 0) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Update employee status and permissions
        await db.query(
            `UPDATE employee 
             SET status = ?, 
                 designation = ?, 
                 manage_devices = ?, 
                 send_announcement = ?, 
                 manage_users = ?, 
                 can_see_complaints = ? 
             WHERE e_id = ?`,
            [status, designation, manageDevices, sendAnnouncement, manageUsers, canSeeComplaints, employeeId]
        );

        res.json({ message: "Employee approved and roles assigned successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



// Get all employees with user details
export const getAllEmployees = async (req, res) => {
  try {
    const [employees] = await db.execute(`
      SELECT e.e_id, u.user_name, u.email, u.contact_number, e.designation, e.status,
             e.manage_devices, e.send_announcement, e.manage_users, e.can_see_complaints
      FROM employee e
      JOIN user u ON e.u_id = u.id
    `);
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving employees", error: err.message });
  }
};

// Update employee permissions and designation

export const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const {
    status,
    designation,
    manage_devices,
    send_announcement,
    manage_users,
    can_see_complaints
  } = req.body;

  // Build dynamic SQL based on the fields provided
  const fieldsToUpdate = [];
  const values = [];

  if (status !== undefined) {
    fieldsToUpdate.push("status = ?");
    values.push(status);
  }

  if (designation !== undefined) {
    fieldsToUpdate.push("designation = ?");
    values.push(designation);
  }

  if (manage_devices !== undefined) {
    fieldsToUpdate.push("manage_devices = ?");
    values.push(manage_devices);
  }

  if (send_announcement !== undefined) {
    fieldsToUpdate.push("send_announcement = ?");
    values.push(send_announcement);
  }

  if (manage_users !== undefined) {
    fieldsToUpdate.push("manage_users = ?");
    values.push(manage_users);
  }

  if (can_see_complaints !== undefined) {
    fieldsToUpdate.push("can_see_complaints = ?");
    values.push(can_see_complaints);
  }

  // If nothing is provided
  if (fieldsToUpdate.length === 0) {
    return res.status(400).json({ message: "No fields provided for update" });
  }

  try {
    const [result] = await db.execute(
      `
      UPDATE employee
      SET ${fieldsToUpdate.join(", ")}
      WHERE e_id = ?
    `,
      [...values, employeeId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found or no changes made" });
    }

    res.status(200).json({ message: "Employee updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
};

// Delete employee record and associated user record
export const deleteEmployee = async (req, res) => {
    const { employeeId } = req.params;

    try {
        // Get the user ID associated with the employee
        const [employee] = await db.execute(`
            SELECT u_id FROM employee WHERE e_id = ?
        `, [employeeId]);

        if (employee.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const userId = employee[0].u_id;

        // Delete the employee record
        await db.execute(`
            DELETE FROM employee WHERE e_id = ?
        `, [employeeId]);

        // Delete the associated user record
        await db.execute(`
            DELETE FROM user WHERE id = ?
        `, [userId]);

        res.status(200).json({ message: "Employee and associated user deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


//get employee by id
export const getEmployeeById = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const [employee] = await db.execute(`
      SELECT e.*, u.user_name, u.email, u.contact_number
      FROM employee e
      JOIN user u ON e.u_id = u.id
      WHERE e.e_id = ?
    `, [employeeId]);

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//get employee by user id
export const getEmployeeByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const [employee] = await db.execute(`
      SELECT e.*, u.user_name, u.email, u.contact_number
      FROM employee e
      JOIN user u ON e.u_id = u.id
      WHERE e.u_id = ?
    `, [userId]);

    if (employee.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employee[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//add employee 
export const addEmployee = async (req, res) => {
    const { userId, designation, status, manageDevices, sendAnnouncement, manageUsers, canSeeComplaints } = req.body;
  
    try {
      // Check if the user exists
      const [user] = await db.execute("SELECT * FROM user WHERE id = ?", [userId]);
  
      if (user.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Insert new employee record
      await db.execute(
        `INSERT INTO employee (u_id, designation, status, manage_devices, send_announcement, manage_users, can_see_complaints) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, designation, status, manageDevices, sendAnnouncement, manageUsers, canSeeComplaints]
      );
  
      res.json({ message: "Employee added successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  };