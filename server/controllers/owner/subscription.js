import db from "../../config/dbconfig.js"; 

export const createSubscription = async (req, res) => {
    try {
      const { package_id } = req.body;
      const subscriber_id = req.user.farmOwnerId;
      
      if (!package_id) {
        return res.status(400).json({ message: "Package ID is required." });
      }
      // Check if the user already has an active subscription
      const [existingSubscriptions] = await db.query(
        `SELECT * FROM subscription WHERE subscriber_id = ? AND status = 'Active'`,
        [subscriber_id]
      );
      if (existingSubscriptions.length > 0) {
        return res.status(400).json({ message: "You already have an active subscription." });
      }
      // Step 1: Get duration from the selected package
      const [packageRows] = await db.query(`SELECT duration FROM packages WHERE id = ?`, [package_id]);
  
      if (packageRows.length === 0) {
        return res.status(404).json({ message: "Package not found." });
      }
  
      const duration = packageRows[0].duration;
  
      // Step 2: Insert new subscription with calculated end_date
      await db.query(
        `INSERT INTO subscription (subscriber_id, package_id, start_date, end_date)
         VALUES (?, ?, CURRENT_TIMESTAMP, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? DAY))`,
        [subscriber_id, package_id, duration]
      );
  
      res.status(201).json({ message: "Subscription created successfully." });
    } catch (err) {
      console.error("Error creating subscription:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  //change subscription package
  export const changeSubscriptionPackage = async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const { new_package_id } = req.body;
  
      if (!new_package_id) {
        return res.status(400).json({ message: "New package ID is required." });
      }
  
      // Step 1: Get duration from the new package
      const [packageRows] = await db.query(`SELECT duration FROM packages WHERE id = ?`, [new_package_id]);
  
      if (packageRows.length === 0) {
        return res.status(404).json({ message: "Package not found." });
      }
  
      const duration = packageRows[0].duration;
  
      // Step 2: Update subscription with new package and calculated end_date
      await db.query(
        `UPDATE subscription SET package_id = ?, end_date = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? DAY) WHERE id = ?`,
        [new_package_id, duration, subscriptionId]
      );
  
      res.status(200).json({ message: "Subscription package changed successfully." });
    } catch (err) {
      console.error("Error changing subscription package:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  } 
  


  export const updateSubscriptionStatus = async (req, res) => {
    try {
      const  subscriptionId  = req.params.subscription_id;
      const { status, payment_status } = req.body;
  
      if (!status && !payment_status) {
        return res.status(400).json({ message: "No update data provided." });
      }
  
      const fields = [];
      const values = [];
  
      if (status) {
        fields.push("status = ?");
        values.push(status);
      }
  
      if (payment_status) {
        fields.push("payment_status = ?");
        values.push(payment_status);
      }
  
      values.push(subscriptionId);
  
      await db.query(`UPDATE subscription SET ${fields.join(', ')} WHERE id = ?`, values);
  
      res.status(200).json({ message: "Subscription updated successfully." });
    } catch (err) {
      console.error("Error updating subscription:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  export const cancelSubscription = async (req, res) => {
    try {
      const { subscriptionId } = req.params;
      const farmOwnerId = req.user.farmOwnerId;

  
      await db.query(`UPDATE subscription SET status = 'Canceled' WHERE id = ?`, [subscriptionId]);
  
      res.status(200).json({ message: "Subscription canceled successfully." });
    } catch (err) {
      console.error("Error canceling subscription:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

  export const getMySubscriptions = async (req, res) => {
    try {
      const farmOwnerId = req.user.farmOwnerId;
  
      const [rows] = await db.query(`
        SELECT s.*, p.name AS package_name
        FROM subscription s
        JOIN packages p ON s.package_id = p.id
        WHERE s.subscriber_id = ?
        ORDER BY s.start_date DESC
      `, [farmOwnerId]);
  
      res.status(200).json(rows);
    } catch (err) {
      console.error("Error fetching your subscriptions:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };

  export const getSubscriptionsByOwnerId = async (req, res) => {
    const { ownerId } = req.params; // passed in URL as /get-subscriptions/:ownerId
  
    try {
      const [rows] = await db.query(
        `
        SELECT s.*, p.name AS package_name
        FROM subscription s
        JOIN packages p ON s.package_id = p.id
        WHERE s.subscriber_id = ?
        ORDER BY s.start_date DESC
        `,
        [ownerId]
      );
  
      res.status(200).json(rows);
    } catch (err) {
      console.error("Error fetching subscriptions for owner:", err);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  