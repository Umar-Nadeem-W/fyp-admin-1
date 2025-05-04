import db from "../../config/dbconfig.js";

// Corrected CreatedAt Columns Mapping
const createdAtColumns = {
  farm: "created_at",
  farm_worker: "created_at",
  pond: "created_at",
  devices: "created_at",
  installations: "created_at",
  fish_stocking: "created_at",
};

// Helper function to check if a column exists
const checkColumnExists = async (table, column) => {
  const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
  return columns.length > 0;
};

// Helper function to get count
const getCount = async (sql) => {
  const [rows] = await db.query(sql);
  return rows[0]?.count || 0;
};

// Helper function to get trend safely
const getTrend = async (table) => {
  const column = createdAtColumns[table];
  if (!column) return "0%";

  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return "0%"; // If column doesn't exist, return "0%"

  const [rows] = await db.query(`
    SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS count
    FROM ${table}
    GROUP BY label
    ORDER BY label DESC
    LIMIT 2
  `);

  if (rows.length < 2) return "0%";

  const [latest, previous] = rows;
  const increase = ((latest.count - previous.count) / (previous.count || 1)) * 100;
  return `${increase.toFixed(2)}%`;
};

// Helper function to get chart data safely
const getChartData = async (table) => {
  const column = createdAtColumns[table];
  if (!column) return [];

  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return []; // If column doesn't exist, return empty array

  const [rows] = await db.query(`
    SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS value
    FROM ${table}
    GROUP BY label
    ORDER BY label ASC
    LIMIT 6
  `);

  return rows;
};

// Controller function
export const getDashboardData = async (req, res) => {
  try {
    const totalFarms = await getCount("SELECT COUNT(*) AS count FROM farm");
    const totalWorkers = await getCount("SELECT COUNT(*) AS count FROM farm_worker");
    const totalPonds = await getCount("SELECT COUNT(*) AS count FROM pond");
    const totalDevices = await getCount("SELECT COUNT(*) AS count FROM devices");
    const totalInstallations = await getCount("SELECT COUNT(*) AS count FROM installations");
    const totalFish = await getCount("SELECT COUNT(*) AS count FROM fish_stocking");
    const totalSubscriptions = await getCount("SELECT COUNT(*) AS count FROM subscription"); // if exists

    const farmsIncrease = await getTrend("farm");
    const workersIncrease = await getTrend("farm_worker");
    const pondsIncrease = await getTrend("pond");
    const devicesIncrease = await getTrend("devices");
    const installationsIncrease = await getTrend("installations");
    const fishIncrease = await getTrend("fish_stocking");

    const farmsChart = await getChartData("farm");
    const workersChart = await getChartData("farm_worker");
    const pondsChart = await getChartData("pond");
    const devicesChart = await getChartData("devices");
    const installationsChart = await getChartData("installations");
    const fishChart = await getChartData("fish_stocking");

    res.json({
      data: {
        totalFarms,
        totalWorkers,
        totalPonds,
        totalDevices,
        totalInstallations,
        totalFish,
        totalSubscriptions,
        farmsIncrease,
        workersIncrease,
        pondsIncrease,
        devicesIncrease,
        installationsIncrease,
        fishIncrease,
        activities: [],
        farmsChart,
        workersChart,
        pondsChart,
        devicesChart,
        installationsChart,
        fishChart,
      },
    });
  } catch (err) {
    console.error("Error in getDashboardData:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
