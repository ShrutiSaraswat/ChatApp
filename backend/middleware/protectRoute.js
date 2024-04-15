import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(res.cookies);

    if (!token) {
      return res.status(401).json({ error: "Unauthorized- No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized- Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password"); // yaha humne "userId" islye use kiya hai kyuki humne generateToken.js mein "userId" pass krvaya hai token mein as info
    // we removed password from the token

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;

    next();

    // means after we complete running all the code above next(), then we'll now continue to run the next function( ie, sendMessage in messageRoutes ) ...that's the purpose of next(); here
  } catch (err) {
    console.log("Error in protectRoute", err.message);
    return res.status(500).json({ error: "Internal derver error" });
  }
};

// jab user signIn skta hai tab usko ek token allot hota hai aur usmein uski userId bhi hoti hai, jaisa ki humne token generate krte vakt daala tha
// yaha hum uss token ko dhundkr, usse verify kr rhe haina aur usmein se vo userId nikal rhe hain....

export default protectRoute;
