import db from "../../config/dbconfig.js";
export const getSubscriptionsByOwnerId = async (req, res) => {
    const { ownerId } = req.params; // passed in URL as /get-subscriptions/:ownerId
  
    try {
      const [rows] = await db.query("Select * from subscription");
  
      res.status(200).json(rows);
    } catch (err) {
      console.error("Error fetching subscriptions for owner:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  