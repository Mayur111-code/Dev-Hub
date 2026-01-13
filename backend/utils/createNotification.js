import Notification from "../model/Notification.js";

/**
 * createNotification helper
 * params: { user, sender, type, postId, projectId }
 * user = the user who should receive the notification
 * sender = the user who triggered the action
 */
const createNotification = async ({ user, sender, type, postId = null, projectId = null }) => {
  try {
    // don't create self-notifications
    if (!user || user.toString() === sender?.toString()) return;

    await Notification.create({
      user,
      sender,
      type,
      postId,
      projectId
    });
  } catch (err) {
    console.log("Notification error:", err.message);
  }
};

export default createNotification;
