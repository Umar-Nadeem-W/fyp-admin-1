import db from "../../config/dbconfig.js";

// Map of tables and their created_at columns
const createdAtColumns = {
  farm: "created_at",
  packages: "created_at",
  subscription: "created_at",
};

// Helper function: Check if a column exists
const checkColumnExists = async (table, column) => {
  const [columns] = await db.query(`SHOW COLUMNS FROM ${table} LIKE ?`, [column]);
  return columns.length > 0;
};

// Helper function: Get count
const getCount = async (sql, params = []) => {
    const [rows] = await db.query(sql, params);
    return rows[0]?.count || 0;
  };
  

// Helper function: Get trend percentage
const getTrend = async (table) => {
  const column = createdAtColumns[table];
  if (!column) return "0%";

  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return "0%";

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

// Helper function: Get chart data
const getChartData = async (table) => {
  const column = createdAtColumns[table];
  if (!column) return [];

  const columnExists = await checkColumnExists(table, column);
  if (!columnExists) return [];

  const [rows] = await db.query(`
    SELECT DATE_FORMAT(${column}, '%Y-%m') AS label, COUNT(*) AS value
    FROM ${table}
    GROUP BY label
    ORDER BY label ASC
    LIMIT 6
  `);

  return rows;
};

// 🎯 Main Controller
export const getEmployeeDashboardData = async (req, res) => {
  try {
    const employeeId = req.user?.id || req.query.id; // Get from auth/session or query

    // Total farms assigned to employee (assuming relation in `employee` or via join table)
    const totalFarms = await getCount(`SELECT COUNT(*) AS count FROM farm`);

    // Total available service plans
    const totalServicePlans = await getCount(`SELECT COUNT(*) AS count FROM packages`);

    // Total subscriptions
    const totalSubscriptions = await getCount(`SELECT COUNT(*) AS count FROM subscription`);

    const farmTrend = await getTrend("farm");
    const packageTrend = await getTrend("packages");
    const subscriptionTrend = await getTrend("subscription");

    const farmChart = await getChartData("farm");
    const packageChart = await getChartData("packages");
    const subscriptionChart = await getChartData("subscription");

    res.json({
      data: {
        totalFarms,
        totalServicePlans,
        totalSubscriptions,
        farmTrend,
        packageTrend,
        subscriptionTrend,
        farmChart,
        packageChart,
        subscriptionChart,
      },
    });
  } catch (err) {
    console.error("Error in getEmployeeDashboardData:", err);
    res.status(500).json({ error: "Failed to load employee dashboard data" });
  }
};
