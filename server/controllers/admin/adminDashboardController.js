import db from "../../config/dbconfig.js";

export const getDashboardData = async (req, res) => {
  try {
    const getCount = async (sql) => {
      const [rows] = await db.query(sql);
      return rows[0]?.count || 0;
    };

    const getPieChartData = async (sql) => {
      const [rows] = await db.query(sql);
      return rows.map((row) => ({
        label: row.label,
        value: row.value,
      }));
    };

    // Total counts
    const totalFarmOwners = await getCount("SELECT COUNT(*) AS count FROM farm_owner");
    const totalFarms = await getCount("SELECT COUNT(*) AS count FROM farm");
    const totalEmployees = await getCount("SELECT COUNT(*) AS count FROM employee");
    const totalServicePlans = await getCount("SELECT COUNT(*) AS count FROM packages");

    // Pie chart data (grouping by existing fields)
    const farmOwnerChart = await getPieChartData(`
      SELECT 
        CASE 
          WHEN status = 0 THEN 'Pending'
          WHEN status = 1 THEN 'Approved'
          ELSE 'Unknown'
        END AS label,
        COUNT(*) AS value
      FROM farm_owner
      GROUP BY label
    `);
    

    const farmChart = await getPieChartData(`
      SELECT city AS label, COUNT(*) AS value FROM farm GROUP BY city
    `); 

    const employeeChart = await getPieChartData(`
      SELECT designation AS label, COUNT(*) AS value FROM employee GROUP BY designation
    `); 

    const servicePlanChart = await getPieChartData(`
      SELECT name AS label, COUNT(*) AS value FROM packages GROUP BY name
    `);

    res.json({
      stats: {
        totalFarmOwners,
        farmOwnerIncrease: "N/A",
        totalFarms,
        farmsIncrease: "N/A",
        totalEmployees,
        employeesIncrease: "N/A",
        totalServicePlans,
        servicePlansIncrease: "N/A",
      },
      charts: {
        farmOwners: farmOwnerChart,
        totalFarms: farmChart,
        employees: employeeChart,
        servicePlans: servicePlanChart,
      },
    });
  } catch (err) {
    console.error("Error in getDashboardData:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
