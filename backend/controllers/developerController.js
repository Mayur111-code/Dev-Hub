import User from "../model/User.js"

// All developers list
export const getAllDevelopers = async (req, res) => {
  try {
    const { search, skill } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (skill) {
      filter.skills = { $regex: skill, $options: "i" };
    }

    const devs = await User.find(filter)
      .select("-password")               // FIXED IMPORTANT
      .limit(100)
      .sort({ createdAt: -1 });

    res.json(devs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error in developers list" });
  }
};

// single developer profile 
export const getDeveloperProfile = async (req, res) => {
  try {
    const dev = await User.findById(req.params.id)
      .select("-password");

    if (!dev) {
      return res.json({ message: "Developer not found" });
    }

    res.json(dev);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
