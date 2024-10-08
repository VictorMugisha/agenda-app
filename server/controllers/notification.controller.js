import NotificationModel from "../models/notification.model.js";

export async function getNotifications(req, res) {
  try {
    const notifications = await NotificationModel.find({
      recipients: req.loggedInUser._id,
    })
      .sort({ createdAt: -1 })
      .populate("author", "firstName lastName")
      .populate("group", "name");

    res.status(200).json(notifications);
  } catch (error) {
    console.log("Error in getNotifications controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function markNotificationAsRead(req, res) {
  try {
    const { id } = req.params;
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: id, recipients: req.loggedInUser._id },
      { $set: { isRead: true } },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    console.log("Error in markNotificationAsRead controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export const getUnreadNotificationsCount = async (req, res) => {
  try {
    const userId = req.loggedInUser._id;
    const count = await NotificationModel.countDocuments({ 
      recipients: userId, 
      isRead: false 
    });
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export async function deleteNotification(req, res) {
  try {
    const { id } = req.params;
    const result = await NotificationModel.deleteOne({
      _id: id,
      recipients: req.loggedInUser._id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Notification not found or you're not authorized to delete it" });
    }

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in deleteNotification controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
