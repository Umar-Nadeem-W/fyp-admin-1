import db from "../config/dbconfig.js";

// Send Announcement to ALL Farm Owners
// Send announcement to a specific farm owner
export const sendAnnouncementToOne = async (req, res) => {
  const { recipient_id, message, notification_type } = req.body;

  if (!recipient_id || !message || !notification_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await db.query(
      `INSERT INTO notifications (recipient_id, message, notification_type) VALUES (?, ?, ?)`,
      [recipient_id, message, notification_type]
    );

    res.status(201).json({ message: "Announcement sent successfully." });
  } catch (error) {
    console.error("Send error:", error);
    res.status(500).json({ error: "Failed to send announcement" });
  }
};

// Get all farm owners with user_name and user_id
export const getAllFarmOwnersfornotification = async (req, res) => {
  try {
    const [owners] = await db.query(`
      SELECT u.id, u.user_name AS owner_name
      FROM farm_owner fo
      JOIN user u ON fo.user_id = u.id
    `);

    res.status(200).json(owners);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch farm owners" });
  }
};



// Get Logged-in User's Notifications
export const getNotifications = async (req, res) => {
  const userId = req.user.id;

  try {
    const [notifications] = await db.query(
      `SELECT id, message, notification_type, is_read FROM notifications WHERE recipient_id = ? ORDER BY id DESC`,
      [userId]
    );
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

// Delete a notification for the logged-in user
export const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      `DELETE FROM notifications WHERE id = ? AND recipient_id = ?`,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notification not found or unauthorized" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ error: "Failed to delete notification" });
  }
};
