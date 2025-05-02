import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();  // Load your .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});


app.get("/api/dashboard", async (req, res) => {
  try {
    const getCount = (sql) =>
      new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
          if (err) reject(err);
          else resolve(results[0]?.count || 0);
        });
      });

    const getTrend = (table, column) =>
      new Promise((resolve, reject) => {
        db.query(`
          SELECT COUNT(*) AS count
          FROM ${table}
          GROUP BY DATE_FORMAT(${column}, '%Y-%m')
          ORDER BY DATE_FORMAT(${column}, '%Y-%m') DESC
          LIMIT 2
        `, (err, results) => {
          if (err) return reject(err);
          if (results.length < 2) return resolve("0%");
          const [latest, previous] = results;
          const increase = ((latest.count - previous.count) / (previous.count || 1)) * 100;
          resolve(`${increase.toFixed(2)}%`);
        });
      });

    const getChartData = (table, column) =>
      new Promise((resolve, reject) => {
        db.query(`
          SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS value
          FROM ${table}
          GROUP BY label
          ORDER BY label
          LIMIT 6
        `, (err, results) => {
          if (err) reject(err);
          else resolve(results);
        });
      });

    // Counts
    const totalFarmOwners = await getCount("SELECT COUNT(*) AS count FROM farm_owner");
    const totalFarms = await getCount("SELECT COUNT(*) AS count FROM farm");
    const totalEmployees = await getCount("SELECT COUNT(*) AS count FROM employee");
    const totalServicePlans = await getCount("SELECT COUNT(*) AS count FROM packages");

    // Trends (Month-over-Month)
    const farmOwnerIncrease = await getTrend("farm_owner", "created_at");
    const farmsIncrease = await getTrend("farm", "created_at");
    const employeesIncrease = await getTrend("employee", "created_at");
    const servicePlansIncrease = await getTrend("packages", "created_at");

    // Charts
    const farmOwnersChart = await getChartData("farm_owner", "created_at");
    const totalFarmsChart = await getChartData("farm", "created_at");
    const employeesChart = await getChartData("employee", "created_at");
    const servicePlansChart = await getChartData("packages", "created_at");

    res.json({
      stats: {
        totalFarmOwners,
        farmOwnerIncrease,
        totalFarms,
        farmsIncrease,
        totalEmployees,
        employeesIncrease,
        totalServicePlans,
        servicePlansIncrease,
      },
      charts: {
        farmOwners: farmOwnersChart,
        totalFarms: totalFarmsChart,
        employees: employeesChart,
        servicePlans: servicePlansChart,
      },
    });
  } catch (err) {
    console.error("Error in /api/dashboard:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
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

const INSTALLATION_ID = 1;

app.get("/insert_data", (req, res) => {
  const { temp, ph, turbidity, do_value } = req.query;

  const sql = "INSERT INTO pond_data (installation_id, temp, ph, turbidity, dissolved_oxygen) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [INSTALLATION_ID, temp, ph, turbidity, do_value], (err) => {
    if (err) {
      console.error("Insert error:", err.sqlMessage);
      return res.status(500).send("DB Insert Error: " + err.sqlMessage);
    }
    res.send("Data inserted into pond_data");
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
    "INSERT INTO farm_owner (owner_name, user_id, number_of_farms, status, registration_date) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [owner_name, user_id, number_of_farms, status, registration_date],
    (err, result) => {
      if (err) {
        console.error("Error inserting farm owner:", err);
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

// GET all packages
app.get("/api/packages", (req, res) => {
  db.query("SELECT * FROM packages", (err, results) => {
    if (err) return res.status(500).json({ error: "Error fetching packages" });
    res.json(results);
  });
});

// CREATE package
app.post("/api/packages", (req, res) => {
  const { name, description, price, duration, max_sites, max_ponds, max_workers } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  const sql = `
    INSERT INTO packages (name, description, price, duration, max_sites, max_ponds, max_workers)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, description, price, duration, max_sites, max_ponds, max_workers],
    (err, result) => {
      if (err) {
        console.error("DB Insert Error:", err);
        return res.status(500).json({ error: "Insert failed" });
      }
      res.status(201).json({ id: result.insertId });
    }
  );
});

// UPDATE package
app.put("/api/packages/:id", (req, res) => {
  const { name, description, price, duration, max_sites, max_ponds, max_workers } = req.body;
  const sql = `
    UPDATE packages SET name=?, description=?, price=?, duration=?, max_sites=?, max_ponds=?, max_workers=?
    WHERE id=?
  `;
  db.query(
    sql,
    [name, description, price, duration, max_sites, max_ponds, max_workers, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: "Update failed" });
      res.json({ message: "Package updated" });
    }
  );
});

// DELETE package
app.delete("/api/packages/:id", (req, res) => {
  db.query("DELETE FROM packages WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ message: "Package deleted" });
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