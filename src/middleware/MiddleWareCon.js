const model = require("../../models/index");
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/constants");
async function authenticateToken(req, res, next) {
  console.log(req.body);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    // return res.status(401).json({ message: "Access Denied" });
    return res.status(401).json(errorResponse("Access Denied", res.statusCode));
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        //return res.status(403).json({ message: "You are Unauthorized" });
        return res
          .status(403)
          .json(errorResponse("You are Unauthorized", res.statusCode));
      } else {
        req.user = user;
        next();
      }
    });
  }
}
module.exports = authenticateToken;
