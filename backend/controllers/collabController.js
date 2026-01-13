import CollabRequest from "../model/CollabRequest.js";
import Post from "../model/Post.js";
import User from "../model/User.js";
import createNotification from "../utils/createNotification.js";

// Send Collaboration Request
export const sendRequest = async (req, res) => {
  try {
    const { postId, to } = req.body;

    const exists = await CollabRequest.findOne({
      from: req.user.id,
      to,
      postId,
      status: "pending"
    });

    if (exists) {
      return res.json({ message: "Request already sent" });
    }

    const request = await CollabRequest.create({
      from: req.user.id,
      to,
      postId
    });

    // create notification to the owner
    await createNotification({
      user: to,
      sender: req.user.id,
      type: "collab_request",
      postId
    });

    res.json({ message: "Request sent", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept Request
export const acceptRequest = async (req, res) => {
  try {
    const request = await CollabRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";
    await request.save();

    // notify requester that they were accepted
    await createNotification({
      user: request.from,
      sender: req.user.id,
      type: "collab_accepted",
      projectId: request.postId
    });

    res.json({ message: "Request accepted", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject Request
export const rejectRequest = async (req, res) => {
  try {
    const request = await CollabRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// See all Requests sent to me (Creator)
export const myRequests = async (req, res) => {
  try {
    const requests = await CollabRequest.find({ to: req.user.id })
      .populate("from", "name avatar skills")
      .populate("postId");

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
