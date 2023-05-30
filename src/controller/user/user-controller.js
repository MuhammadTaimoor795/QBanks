require("dotenv").config();
const models = require("../../../models");

const bcrypt = require("bcrypt");
const generateAccessToken = require("../../auth/helper/generateAccessTokens");
const jwt = require("jsonwebtoken");

const authServices = require("../../auth/helper/authService");
const emailValidator = require("email-validator");
const multer = require("multer");
const { success, errorResponse } = require("../../utils/constants");

const {
  encypttext,
  findUserById,
  findUserByEmail,
  UserRegister,
  dencypttext,
} = require("../../services/user/user.service");
const { ApiError } = require("../../utils/error");

const registerUserController = async (req, res, next) => {
  try {
    //const body = await registerSchema.validateAsync(req.body);

    let { username, email, password, country, description } = req.body;
    email = email.toLowerCase();
    username = username.toLowerCase();

    const dbUsers = await models.User.findOne({
      where: {
        email: email,
      },
    });
    if (dbUsers) {
      throw new ApiError(
        "You are already registered with this email. Try to login into the site",
        { status: 409 }
      );
    }
    const isUser = await models.User.findOne({
      where: {
        username,
      },
    });
    if (isUser) {
      throw new ApiError("User name already Exist", { status: 409 });
    }

    const user = await UserRegister(
      username,
      email,
      password,
      country,
      description,
      (origin = req.get("origin"))
    );
    if (user) {
      return res
        .status(200)
        .json(
          success(
            `Signup Successfull And Verification Email is Send to your email `,
            res.statusCode
          )
        );
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const verificationEmail = async (req, res, next) => {
  try {
    console.log("Verification :", req.query.token);
    let token = req.query.token;
    const verify = await models.User.update(
      {
        verificationToken: null,
        isVerified: true,
      },
      {
        where: {
          verificationToken: token,
        },
      }
    );

    console.log(verify);
    if (verify.toString() != 0) {
      return res
        .status(200)
        .json(success("verify Successfully", res.statusCode));
    } else {
      throw new Error("In valid Verification Token", { status: 400 });
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};
const loginUserController = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();
    let dbUser = await findUserByEmail(email);
    if (!dbUser) {
      throw new ApiError("Email is not registered with us", { status: 400 });
    }
    if (!dbUser.isVerified) {
      throw new ApiError("Email is not verified", { status: 400 });
    }
    if (!dbUser.isActive) {
      throw new ApiError("Your Account is not Activated Yet by Admin", {
        status: 400,
      });
    }
    if (dbUser.isBlocked) {
      throw new ApiError(
        "Your has been blocked , contact the Admin for more information",
        { status: 400 }
      );
    }

    const compare = bcrypt.compareSync(password, dbUser.password);
    if (!compare) {
      throw new ApiError("Password doesn't match", { status: 400 });
    }
    let user = { name: dbUser.username, id: dbUser.id };
    let accessToken = generateAccessToken(user);
    let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    let updateTokens = await models.User.update(
      {
        refreshToken,
      },
      { where: { email } }
    );

    if (updateTokens) {
      const dbUserUpdated = await models.User.findOne({
        where: {
          email: email,
        },
      });

      return res.status(200).json(
        success(
          {
            user: dbUser,
            accessToken: accessToken,
            refreshToken: refreshToken,
          },
          res.statusCode
        )
      );
    } else {
      throw new ApiError("Error in refresh tokens", { status: 403 });
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const logoutUserController = async (req, res, next) => {
  try {
    console.log(req.user);
    let userId = req.user.id;
    const userStatusUpdate = await models.User.update(
      {
        status: false,
        refreshToken: "",
      },
      {
        where: {
          id: userId,
        },
      }
    );
    const findUser = await models.User.findOne({
      where: {
        id: userId,
      },
    });

    if (userStatusUpdate) {
      // Adding User logout Stat
      let addStat = await UserLogOutStat(userId);
      if (addStat) {
        Socket.sendAdmin(USER_STATUS, { findUser, status: false });
        return res
          .status(200)
          .json(success("User Logged out successfully", res.statusCode));
      }
    } else {
      return res
        .status(400)
        .json(errorResponse("User unable to log out", res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const refreshTokens = async (req, res, next) => {
  try {
    let refreshToken = req.body.token;
    console.log("body", refreshToken);
    if (refreshToken == null) return res.sendStatus(401);
    let checkrefreshToken = await models.User.findOne({
      where: { refreshToken },
    });
    if (!checkrefreshToken) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          // console.log("user :", user);
          console.log("yes error ");
          return res.sendStatus(403);
        }
        let accessToken = generateAccessToken({
          id: user.id,
          name: user.username,
        });
        // console.log("usesr    :", user);

        let newrefreshToken = jwt.sign(
          {
            id: user.id,
            name: user.username,
          },
          process.env.REFRESH_TOKEN_SECRET,
          {
            expiresIn: "500s",
          }
        );

        await models.User.update(
          { refreshToken: newrefreshToken },
          { where: { id: user.id } }
        );
        res.json({ accessToken: accessToken, refreshToken: newrefreshToken });
      }
    );
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

// refreshTokens: async (req, res, next) => {
//   try {
//     var username = req.body.username;
//     username = username.toLowerCase();
//     const dbUsers = await models.User.findOne({
//       where: {
//         username,
//       },
//     });
//     if (dbUsers) {
//       res.status(400).send({
//         data: null,
//         error: "User name already Exist",
//         success: false,
//       });
//       // res.status(500).send('you are already registered with this email. Try to login into the site')
//     }
//   } catch (error) {
//     return res.status(500).json(error(error.message, res.statusCode));;
//   }
// },
const forgotPasswordController = async (req, res, next) => {
  try {
    var email = req.body.email;
    email = email.toLowerCase();
    if (emailValidator.validate(email)) {
      const checker = await authServices.sendVerificationEmailForgetPassword(
        email
      );

      if (!checker) {
        throw new ApiError("Email is not registered", { status: 409 });
      } else {
        return res
          .status(200)
          .json(
            success(
              "Please check your email for password reset instructions",
              res.statusCode
            )
          );
      }
    } else {
      throw new ApiError("Invalid Email", { status: 400 });
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};
const resetPasswordController = async (req, res, next) => {
  try {
    // console.log("Resetting password : ", req.body);
    // console.log(req.query.resetToken);
    const token = req.query.resetToken;
    const password = req.body.password;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.findOne({
      where: {
        verificationToken: token,
      },
    });
    // console.log(user);
    if (!user) {
      throw new ApiError("Invalid Link", { status: 400 });
    } else {
      user.password = hashPassword;
      user.verificationToken = null;
      await user.save();
      return res
        .status(200)
        .json(success("Password successfully updated", res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const userImgController = async (req, res, next) => {
  if (!req.file) {
    return res.status(404).send({ message: "File not found" });
  }
  try {
    const { path } = req.file;
    const url = path.toString().trim().replace(/\s/g, "");
    let user;
    if (req.imageType === "profileImage") {
      user = await models.User.update(
        {
          profileImage: process.env.IMAGE_PATH_ORIGIN + url,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
    } else if (req.imageType === "coverImage") {
      user = await models.User.update(
        {
          coverImage: process.env.IMAGE_PATH_ORIGIN + url,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
    } else if (req.imageType === "backgroundImage") {
      user = await models.User.update(
        {
          backgroundImage: process.env.IMAGE_PATH_ORIGIN + url,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
    } else {
      throw new ApiError("Invalid File type", { status: 400 });
    }
    if (user) {
      return res
        .status(200)
        .json(success("Picture Uploaded successfully", res.statusCode));
    } else {
      throw new ApiError("Picture creation failed", { status: 400 });
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};
const userProfile = async (req, res, next) => {
  try {
    const userid = req.user.id;
    let user = await models.User.findOne({
      where: {
        id: userid,
      },
      include: [
        {
          model: models.UserQbank,
          include: [
            {
              model: models.QBanks,
            },
          ],
        },
      ],
    });

    if (user) {
      return res.status(200).json(success(user, res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error?.status)
      .json(errorResponse(error.message, error?.status));
  }
};

const userProfileUpdate = async (req, res, next) => {
  try {
    let path = "";
    let url = "";
    let profileImage = null;
    if (req.file) {
      path = req.file.path;
      url = path.toString().trim().replace(/\s/g, "");
      profileImage = process.env.IMAGE_PATH_ORIGIN + url;
    }
    const userid = req.user.id;
    const { username, description, country } = req.body;
    let user = await models.User.findOne({
      where: {
        id: userid,
      },
    });

    if (!user) {
      throw new ApiError("User Not Found", { status: 409 });
    } else {
      const updatedUser = await models.User.update(
        {
          username: username,
          description: description,
          country: country,
          profileImage: profileImage || user.profileImage,
        },
        { where: { id: user.id } }
      );
      if (updatedUser) {
        const saveNotification = await createNotification(
          "User",
          "Profile Updated Successfull",
          "You have successfully updated your profile",
          userid
        );
        return res
          .status(200)
          .json(success("User updated successfully", res.statusCode));
      } else {
        throw new ApiError("User Not Updated", { status: 409 });
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
};

const userPasswordUpdate = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const { oldpassword, password } = req.body;
    let user = await models.User.findOne({
      where: {
        id: userid,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(errorResponse("User not found", error.status));
    } else {
      const compare = bcrypt.compareSync(oldpassword, user.password);
      if (!compare) {
        throw new ApiError("Current password does not match", { status: 409 });
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        const updatedUser = await models.User.update(
          {
            password: hashPassword,
          },
          { where: { id: user.id } }
        );
        if (updatedUser) {
          return res
            .status(200)
            .json(success("User Password change successfully", res.statusCode));
        } else {
          return res
            .status(400)
            .json(errorResponse("User password not changed", error.status));
        }
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
};

const userQbank = async (req, res, next) => {
  try {
    let id = req.user.id;
    let user = await models.User.findOne({
      where: {
        id,
      },
      include: [
        {
          required: false,
          where: {
            active: true,
          },
          model: models.UserQbank,
          include: [
            {
              model: models.QBanks,
              include: [
                {
                  model: models.Test,
                },
              ],
            },
          ],
        },
      ],
    });

    if (user) {
      return res.status(200).json(success(user, res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};
const userQbankTest = async (req, res, next) => {
  try {
    let id = req.user.id;
    let qbankid = req.params.id;

    let qbank = await models.UserQbank.findOne({
      where: {
        UserId: id,
        QBankId: qbankid,
        isactive: true,
      },
    });

    if (qbank) {
      let tests = await models.Test.findAll({
        where: {
          QBankId: qbankid,
        },
      });
      if (tests) {
        return res.status(200).json(success(tests, res.statusCode));
      }
    } else {
      return res
        .status(403)
        .json(errorResponse("You are not Allowed for this test", 403));
    }

    // let user = await models.User.findOne({
    //   where: {
    //     id,
    //   },
    //   include: [
    //     {
    //       required: false,
    //       where: {
    //         active: true,
    //       },
    //       model: models.UserQbank,
    //       include: [
    //         {
    //           model: models.QBanks,
    //           include: [
    //             {
    //               model: models.Test,
    //             },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // });

    if (user) {
      return res.status(200).json(success(user, res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

const userNewTest = async (req, res, next) => {
  try {
    let id = req.user.id;
    let testid = req.body.testid;
    // console.table({ id, testid });
    let test = await findtest(testid, id);

    let usertest = await models.UserTest.create({
      UserId: id,
      TestId: test.id,
    });
    if (usertest) {
      return res.status(201).json(success("Test Started ", res.statusCode));
    }
  } catch (error) {
    if (error.status === undefined) {
      error.status = 500;
    }
    return res
      .status(error.status)
      .json(errorResponse(error.message, error.status));
  }
};

async function findtest(id, userid) {
  let test = await models.Test.findOne({
    where: {
      id,
    },
  });

  //console.log("test", test);

  if (!test) {
    throw new ApiError(`test Not Found with this is ${id}`, {
      status: 404,
    });
  }

  if (!test.isactive) {
    throw new ApiError(`Test is blocked By the Admin `, {
      status: 400,
    });
  }

  console.log("useri", id);
  console.log("test.QBankId", test.QBankId);

  let userqbank = await models.UserQbank.findOne({
    where: {
      UserId: userid,
      QBankId: test.QBankId,
      active: true,
    },
  });

  if (userqbank) {
    return test;
  }
  if (!userqbank) {
    throw new ApiError(
      `You can not Attempt this test due As this test in not Allowed to you By Admin`,
      {
        status: 400,
      }
    );
  }
}
module.exports = {
  registerUserController,
  verificationEmail,
  loginUserController,
  logoutUserController,
  refreshTokens,
  forgotPasswordController,
  resetPasswordController,
  userPasswordUpdate,
  userImgController,
  userProfile,
  userProfileUpdate,
  userQbank,
  userNewTest,
};
