import Notification from "../model/Notification.js";

// Get all notifications for logged in user
export const getMyNotifications = async (req, res) => {
  try {
    const list = await Notification.find({ user: req.user.id })
      .populate("sender", "name avatar")
      .populate("postId", "content")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a single notification as read
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all notifications for this user as read
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE NOTIFICATION
export const deleteNotification = async (req, res) => {
  try {
    const noti = await Notification.findById(req.params.id);

    if (!noti) return res.status(404).json({ message: "Notification not found" });

    // sirf owner delete kar sakta hai
    if (noti.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await noti.deleteOne();

    res.json({ message: "Notification deleted" });
  } catch (err) {
    console.error("Delete notification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
