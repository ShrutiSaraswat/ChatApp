import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    // here userId(else depends), is the info embeded in the jws token(used to verify the token), JWT_SECRET_KEY is the key to sign the token
    expiresIn: "15d",
  });
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevents XSS attacks or cross-site scripting attacks
    sameSite: "strict", // prevents CSRF attacks, cross site attacks, forgery attacks
    // secure: process.env.NODE_ENV !== "development",
  });
};

export default generateTokenAndSetCookie;
