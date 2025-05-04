import db from "../../config/dbconfig.js";
import bcrypt from "bcrypt";



// Get all users with their roles
export const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT u.id, u.user_name, u.email, u.gender, u.contact_number, u.image, u.last_login, r.role_name
      FROM user u
      JOIN role r ON u.role_id = r.id
    `);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
};



// Delete a user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const [result] = await db.execute(`
      DELETE FROM user WHERE id = ?
    `, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID with role
export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const [users] = await db.execute(`
      SELECT u.*, r.role_name
      FROM user u
      JOIN role r ON u.role_id = r.id
      WHERE u.id = ?
    `, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.params;
  const {
    user_name,
    email,
    gender,
    contact_number,
    image,
    newPassword,
  } = req.body;

  try {
    let query = `
      UPDATE user
      SET user_name = ?, email = ?, gender = ?, contact_number = ?, image = ?
    `;
    const values = [user_name, email, gender, contact_number, image];

    // If newPassword is provided, hash it and include in query
    if (newPassword) {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);
      query += `, password_hash = ?`;
      values.push(password_hash);
    }

    query += ` WHERE id = ?`;
    values.push(userId);

    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }

    res.status(200).json({
      message: `User updated${newPassword ? ' and password changed' : ''} successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

  //add user for admin


// Add user (for admin)
export const addUser = async (req, res) => {
  const {
    user_name,
    email,
    gender,
    image,
    role_id,
    password,
    contact_number,
  } = req.body;

  try {
    // Check if email already exists
    const [existing] = await db.execute(`SELECT id FROM user WHERE email = ?`, [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Insert user
    const [result] = await db.execute(
      `
      INSERT INTO user (user_name, email, gender, image, role_id, password_hash, contact_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      [user_name, email, gender, image, role_id, password_hash, contact_number]
    );

    res.status(201).json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};
