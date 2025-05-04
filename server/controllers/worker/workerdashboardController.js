import db from "../../config/dbconfig.js";

// Map of tables and their created_at columns
const createdAtColumns = {
  devices: "installation_date",
  pond: "created_at",
  task: "created_at",
  fish_stocking: "date_of_stocking",
};

// Helper function: Check if a column exists
const checkColumnExists = async (table, column) => {
  const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
  return columns.length > 0;
};

// Helper: Get count based on user-specific filter
const getCount = async (sql, params = []) => {
  const [rows] = await db.query(sql, params);
  return rows[0]?.count || 0;
};

// Helper: Get trend percentage
const getTrend = async (table, filterSql, params) => {
  const column = createdAtColumns[table];
  if (!column) return "0%";
  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return "0%";

  const [rows] = await db.query(
    `
    SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS count
    FROM ${table}
    WHERE ${filterSql}
    GROUP BY label
    ORDER BY label DESC
    LIMIT 2
    `,
    params
  );

  if (rows.length < 2) return "0%";
  const [latest, previous] = rows;
  const increase = ((latest.count - previous.count) / (previous.count || 1)) * 100;
  return `${increase.toFixed(2)}%`;
};

// Helper: Get chart data
const getChartData = async (table, filterSql, params) => {
  const column = createdAtColumns[table];
  if (!column) return [];
  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return [];

  const [rows] = await db.query(
    `
    SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS value
    FROM ${table}
    WHERE ${filterSql}
    GROUP BY label
    ORDER BY label ASC
    LIMIT 6
    `,
    params
  );
  return rows;
};

// 🎯 Worker Dashboard Controller
export const getWorkerDashboardData = async (req, res) => {
  try {
    const workerId = req.user?.id || req.query.id;
    if (!workerId) return res.status(400).json({ error: "Worker ID missing" });

    // Get farm_id for the worker
    const [[workerRow]] = await db.query(`SELECT farm_id FROM farm_worker WHERE u_id = ?`, [workerId]);
    const farmId = workerRow?.farm_id;
    if (!farmId) return res.status(404).json({ error: "Worker not assigned to any farm" });

    // Total assigned ponds
    const totalPonds = await getCount(`SELECT COUNT(*) AS count FROM pond WHERE farm_id = ?`, [farmId]);

    // Total installed devices (devices installed in ponds of the farm)
    const totalDevices = await getCount(
      `SELECT COUNT(*) AS count FROM devices d JOIN installations i ON d.id = i.device_id WHERE i.pond_id IN (SELECT id FROM pond WHERE farm_id = ?)`,
      [farmId]
    );

    // Total tasks assigned to worker
    const totalTasks = await getCount(`SELECT COUNT(*) AS count FROM task WHERE assigned_to = ?`, [workerId]);

    // Total fish stock records in worker’s assigned ponds
    const totalFishStock = await getCount(
      `SELECT COUNT(*) AS count FROM fish_stocking WHERE pond_id IN (SELECT id FROM pond WHERE farm_id = ?)`,
      [farmId]
    );

    // Trends and Charts
    const deviceTrend = await getTrend("devices", "id IN (SELECT device_id FROM installations WHERE pond_id IN (SELECT id FROM pond WHERE farm_id = ?))", [farmId]);
    const pondTrend = await getTrend("pond", "farm_id = ?", [farmId]);
    const taskTrend = await getTrend("task", "assigned_to = ?", [workerId]);
    const fishTrend = await getTrend("fish_stocking", "pond_id IN (SELECT id FROM pond WHERE farm_id = ?)", [farmId]);

    const deviceChart = await getChartData("devices", "id IN (SELECT device_id FROM installations WHERE pond_id IN (SELECT id FROM pond WHERE farm_id = ?))", [farmId]);
    const pondChart = await getChartData("pond", "farm_id = ?", [farmId]);
    const taskChart = await getChartData("task", "assigned_to = ?", [workerId]);
    const fishChart = await getChartData("fish_stocking", "pond_id IN (SELECT id FROM pond WHERE farm_id = ?)", [farmId]);

    res.json({
      data: {
        totalDevices,
        totalPonds,
        totalTasks,
        totalFishStock,
        deviceTrend,
        pondTrend,
        taskTrend,
        fishTrend,
        deviceChart,
        pondChart,
        taskChart,
        fishChart,
      },
    });
  } catch (err) {
    console.error("Error in getWorkerDashboardData:", err);
    res.status(500).json({ error: "Failed to load worker dashboard data" });
  }
};
