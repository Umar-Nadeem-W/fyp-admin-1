import db from "../../config/dbconfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";


const JWT_SECRET = process.env.JWT_SECRET;



export const signup = async (req, res) => {
    const { user_name, email, password, role } = req.body;

    if (!user_name || !email || !password || !role) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Get role ID from role table
        const [roleResult] = await db.query("SELECT id FROM role WHERE role_name = ?", [role]);

        if (roleResult.length === 0) {
            return res.status(400).json({ error: "Invalid role provided" });
        }

        const roleId = roleResult[0].id;

        // Check if user already exists
        const [existingUser] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user with user_name
        const [result] = await db.query(
            "INSERT INTO user (user_name, email, password_hash, role_id) VALUES (?, ?, ?, ?)",
            [user_name, email, hashedPassword, roleId]
        );

        const userId = result.insertId;

        // Assign additional details based on role
        if (roleId === 4) { // Farm Owner
            await db.query("INSERT INTO farm_owner (user_id, status, registration_date) VALUES (?, 'Active', NOW())", [userId]);
        } else if (roleId === 2) { // Employee
            await db.query(
                "INSERT INTO employee (u_id, status, designation, manage_devices, send_announcement, manage_users, can_see_complaints) VALUES (?, 'not approved', NULL, FALSE, FALSE, FALSE, FALSE)", 
                [userId]
            );
        }

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Fetch user details
        const [users] = await db.query("SELECT id, email, password_hash, role_id FROM user WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const user = users[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        let farmOwnerId = null;
        let employeeId = null;
        let workerId = null;

        // Check if the user is a Farm Owner
        if (user.role_id === 4) {
            const [farmOwner] = await db.query("SELECT id FROM farm_owner WHERE user_id = ?", [user.id]);
            if (farmOwner.length > 0) {
                farmOwnerId = farmOwner[0].id;
            }
        }

        // Check if the user is an Employee
        if (user.role_id === 2) {
            const [employee] = await db.query("SELECT e_id FROM employee WHERE u_id = ?", [user.id]);
            if (employee.length > 0) {
                employeeId = employee[0].e_id;
            }
        }

        // Check if the user is a Worker
        if (user.role_id === 3) {
            const [worker] = await db.query("SELECT id FROM farm_woker WHERE user_id = ?", [user.id]);
            if (worker.length > 0) {
                workerId = worker[0].id;
            }
        }

        // Generate JWT with additional details
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: user.role_id,
            farmOwnerId,
            employeeId,
            workerId
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token, user: tokenPayload });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};
