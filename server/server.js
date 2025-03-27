require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "2003",
  database: "fyp_website",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});


// GET all farm owners
app.get("/api/farm_owners", (req, res) => {
  const query = "SELECT * FROM farm_owner";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching farm owners:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});

// GET a single farm owner
app.get("/api/farm_owners/:id", (req, res) => {
  const query = "SELECT * FROM farm_owner WHERE id = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Internal server error" });
    if (results.length === 0) return res.status(404).json({ error: "Farm owner not found" });
    res.json(results[0]);
  });
});

// CREATE a farm owner
app.post("/api/farm_owners", (req, res) => {
  const { owner_name, user_id, number_of_farms, status } = req.body;
  const registration_date = new Date();

  const query =
    "INSERT INTO farm_owner (user_id, number_of_farms, status, registration_date, owner_name) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [owner_name, user_id, number_of_farms, status, registration_date],
    (err, result) => {
      if (err) {
        console.error("Error creating farm owner:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ id: result.insertId, ...req.body, registration_date });
    }
  );
});

// UPDATE a farm owner
app.put("/api/farm_owners/:id", (req, res) => {
  const { owner_name, user_id, number_of_farms, status } = req.body;

  const query =
    "UPDATE farm_owner SET owner_name = ?, user_id = ?, number_of_farms = ?, status = ? WHERE id = ?";
  db.query(
    query,
    [owner_name, user_id, number_of_farms, status, req.params.id],
    (err, result) => {
      if (err) {
        console.error("Error updating farm owner:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.json({ message: "Farm owner updated successfully" });
    }
  );
});

// DELETE a farm owner
app.delete("/api/farm_owners/:id", (req, res) => {
  const query = "DELETE FROM farm_owner WHERE id = ?";
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error("Error deleting farm owner:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Farm owner deleted successfully" });
  });
});

// Get all farms
app.get("/api/farms", (req, res) => {
  const sql = `
    SELECT 
      f.id, f.owner_id, f.name, f.address, f.city, f.state, f.country, f.zip, 
      f.number_of_ponds, f.number_of_workers,
      o.owner_name AS owner_name
    FROM farm f
    JOIN farm_owner o ON f.owner_id = o.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching farms with owner names:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});


// GET all employees with employee name from user table
app.get("/api/employee", (req, res) => {
  const sql = `
    SELECT 
      e.*, user_name AS employee_name
    FROM employee e
    JOIN user u ON e.u_id = u.id
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching employees:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json(results);
  });
});


// GET one employee
app.get("/api/employee/:id", (req, res) => {
  db.query("SELECT * FROM employee WHERE e_id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: "Internal error" });
    if (results.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(results[0]);
  });
});

// CREATE employee
app.post("/api/employee", (req, res) => {
  const {
    u_id,
    status,
    designation,
    manage_devices,
    send_announcement,
    manage_users,
    can_see_complaints,
  } = req.body;

  const sql = `
    INSERT INTO employee 
    (u_id, status, designation, manage_devices, send_announcement, manage_users, can_see_complaints)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [
      u_id,
      status,
      designation,
      !!manage_devices,
      !!send_announcement,
      !!manage_users,
      !!can_see_complaints,
    ],
    (err, result) => {
      if (err) {
        console.error("Error adding employee:", err);
        return res.status(500).json({ error: "Error inserting employee" });
      }
      res.status(201).json({ message: "Employee created", id: result.insertId });
    }
  );
});

// UPDATE employee
app.put("/api/employee/:id", (req, res) => {
  const {
    u_id,
    status,
    designation,
    manage_devices,
    send_announcement,
    manage_users,
    can_see_complaints,
  } = req.body;

  const sql = `
    UPDATE employee SET 
    u_id = ?, status = ?, designation = ?, 
    manage_devices = ?, send_announcement = ?, 
    manage_users = ?, can_see_complaints = ?
    WHERE e_id = ?
  `;
  db.query(
    sql,
    [
      u_id,
      status,
      designation,
      !!manage_devices,
      !!send_announcement,
      !!manage_users,
      !!can_see_complaints,
      req.params.id,
    ],
    (err) => {
      if (err) {
        console.error("Error updating employee:", err);
        return res.status(500).json({ error: "Error updating employee" });
      }
      res.json({ message: "Employee updated" });
    }
  );
});

// DELETE employee
app.delete("/api/employee/:id", (req, res) => {
  db.query("DELETE FROM employee WHERE e_id = ?", [req.params.id], (err) => {
    if (err) {
      console.error("Error deleting employee:", err);
      return res.status(500).json({ error: "Error deleting employee" });
    }
    res.json({ message: "Employee deleted" });
  });
});


// Get a specific farm by ID
app.get("/api/farms/:id", (req, res) => {
  const farmId = req.params.id;
  
  db.query("SELECT * FROM farm WHERE id = ?", [farmId], (err, results) => {
    if (err) {
      console.error("Error fetching farm:", err);
      return res.status(500).json({ error: "Database error." });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Farm not found." });
    }
    
    res.status(200).json(results[0]);
  });
});

// Add a new farm with restriction
app.post("/api/farms", (req, res) => {
  const { owner_id, name, address, city, state, country, zip, number_of_ponds, number_of_workers } = req.body;

  if (!owner_id || !name || !address || !city || !state || !country || !zip || number_of_ponds < 0 || number_of_workers < 0) {
    return res.status(400).json({ error: "All fields are required with valid numbers." });
  }

  db.query("SELECT number_of_farms, farms_added FROM farm_owner WHERE id = ?", [owner_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "Invalid owner_id. Farm owner does not exist." });
    }

    const { number_of_farms, farms_added } = results[0];

    if (farms_added >= number_of_farms) {
      return res.status(400).json({ error: "Farm limit reached. Cannot add more farms." });
    }

    const sql =
      "INSERT INTO farm (owner_id, name, address, city, state, country, zip, number_of_ponds, number_of_workers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [owner_id, name, address, city, state, country, zip, number_of_ponds, number_of_workers], (err, result) => {
      if (err) {
        console.error("Error adding farm:", err);
        return res.status(500).json({ error: "Database error." });
      }

      db.query("UPDATE farm_owner SET farms_added = farms_added + 1 WHERE id = ?", [owner_id], (updateErr) => {
        if (updateErr) {
          console.error("Error updating farms_added:", updateErr);
          return res.status(500).json({ error: "Database error." });
        }

        res.status(201).json({ message: "Farm added successfully", id: result.insertId });
      });
    });
  });
});

// Example using Express
app.get("/api/tasks", async (req, res) => {
  const query = `
    SELECT t.*, tc.Task_category as task_category
    FROM task t
    JOIN task_category tc ON t.tk_id = tc.id
  `;
  const [rows] = await db.query(query); // Use your DB connection
  res.json(rows);
});


app.get('/api/farms/:id/ponds', (req, res) => {
  const farmId = req.params.id;
  db.query('SELECT * FROM pond WHERE farm_id = ?', [farmId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});


app.get("/api/workers", (req, res) => {
  const query = "SELECT * FROM farm_worker";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching workers:", err);
      res.status(500).json({ error: "Failed to fetch workers" });
    } else {
      res.json(results);
    }
  });
});

// Get all ponds
app.get("/api/ponds", (req, res) => {
  const farm_id = req.query.farm_id;
  let sql = "SELECT * FROM pond";
  let params = [];

  // Filter ponds by farm_id if provided
  if (farm_id) {
    sql += " WHERE farm_id = ?";
    params.push(farm_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching ponds:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(200).json(results);
  });
});

// Get ponds by farm ID (alternative URL format)
app.get("/api/farms/:farm_id/ponds", (req, res) => {
  const farm_id = req.params.farm_id;
  
  db.query("SELECT * FROM pond WHERE farm_id = ?", [farm_id], (err, results) => {
    if (err) {
      console.error("Error fetching ponds:", err);
      return res.status(500).json({ error: "Database error." });
    }
    res.status(200).json(results);
  });
});

// Get a specific pond by ID
app.get("/api/ponds/:id", (req, res) => {
  const pondId = req.params.id;
  
  db.query("SELECT * FROM pond WHERE id = ?", [pondId], (err, results) => {
    if (err) {
      console.error("Error fetching pond:", err);
      return res.status(500).json({ error: "Database error." });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: "Pond not found." });
    }
    
    res.status(200).json(results[0]);
  });
});

// Add a pond with restriction
app.post("/api/ponds", (req, res) => {
  const { farm_id, name, type, length, width, depth, status } = req.body;

  if (!farm_id || !name || !type || !length || !width || !depth) {
    return res.status(400).json({ error: "All fields are required." });
  }

  db.query("SELECT number_of_ponds FROM farm WHERE id = ?", [farm_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "Invalid farm_id. Farm does not exist." });
    }

    const maxPonds = results[0].number_of_ponds;

    db.query("SELECT COUNT(*) AS pondCount FROM pond WHERE farm_id = ?", [farm_id], (err, pondResult) => {
      if (err) {
        return res.status(500).json({ error: "Database error." });
      }

      if (pondResult[0].pondCount >= maxPonds) {
        return res.status(400).json({ error: "Cannot add more ponds. Pond limit reached." });
      }

      const sql = "INSERT INTO pond (farm_id, name, type, length, width, depth, status) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(sql, [farm_id, name, type, length, width, depth, status || "Stable"], (err, result) => {
        if (err) {
          return res.status(500).json({ error: "Database error." });
        }
        res.status(201).json({ message: "Pond added successfully", id: result.insertId });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});