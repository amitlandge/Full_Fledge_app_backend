const Jwt = require("jsonwebtoken");
const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw {
        messag: "invalid token",
      };
    }
    let decode = await Jwt.verify(token, process.env.SECRETE_KEY);
    req.userData = { userId: decode.userId };
    next();
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};
module.exports = auth;
