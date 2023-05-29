const models = require("../../models/index");
const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/constants");
async function adminCheck(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (token == null) {
      //return res.sendStatus(401);
      return res
        .status(400)
        .json(
          errorResponse("You are not authorized to access", res.statusCode)
        );
    } else {
      console.log("ind ata");
      const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const userId = decode.id;
      console.log("id", userId);
      const user = await models.User.findOne({
        where: {
          id: userId,
        },
        include: [
          {
            model: models.Role,
          },
        ],
      });

      if (user) {
        let role = await models.Role.findOne({
          where: {
            id: user.Role.id,
          },
        });

        if (role.name === "Admin") {
          next();
        } else {
          // return res
          //   .status(401)
          //   .json({ message: "You are not authorized to access" });
          return res
            .status(401)
            .json(
              errorResponse("You are not authorized to access", res.statusCode)
            );
        }
      } else {
        return res
          .status(401)
          .json(errorResponse("Invalid ADmin", res.statusCode));
      }
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
  // if (token == null) {
  //   //return res.sendStatus(401);
  //   return res
  //     .status(400)
  //     .json(errorResponse("You are not authorized to access", res.statusCode));
  // } else {
  //   const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  //   const userId = decode.id;
  //   const user = await models.User.findOne({
  //     where: {
  //       id: userId,
  //     },
  //     include: [
  //       {
  //         model: models.Role,
  //       },
  //     ],
  //   });
  //   console.log("user", user.Role.id);

  //   if (user) {
  //     let role = await models.Role.findOne({
  //       where: {
  //         id: user.Role.id,
  //       },
  //     });

  //     if (role.name === "Admin") {
  //       next();
  //     } else {
  //       // return res
  //       //   .status(401)
  //       //   .json({ message: "You are not authorized to access" });
  //       return res
  //         .status(401)
  //         .json(
  //           errorResponse("You are not authorized to access", res.statusCode)
  //         );
  //     }
  //   } else {
  //     return res
  //       .status(404)
  //       .json(errorResponse("USER NOT FOUND", res.statusCode));
  //   }
  // }
}
module.exports = adminCheck;
