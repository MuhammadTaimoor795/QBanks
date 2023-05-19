const model = require("../../models/index");
const jwt = require("jsonwebtoken");
async function verify(req, res, next) {
  console.log("middleWare  ????????");
  // cons

  const id = req.user.id;
  const user = await model.User.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    return res.status(403).send({
      message: " User not found ",
    });
  }
  if (user.emailVerified == true) {
    req.user = user;
    next();
  } else {
    return res.status(403).send({
      message: " Please verify User email to play game ",
    });
  }
}
module.exports = verify;
