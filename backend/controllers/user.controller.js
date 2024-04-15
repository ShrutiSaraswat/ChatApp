import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // const allUsers = await User.find(); // to find all the users in the datatbase

    const filteredUsers = await User.find({
      id: { $ne: loggedInUserId },
    }).select("-password"); // find all the users who logged in to the chatApp but not the one with the loggenInUserId(ie, us)
    // removing their password field
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getUsersForSidebar", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
