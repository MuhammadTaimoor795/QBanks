const generateAccessToken = require("../../auth/helper/generateAccessTokens");
const authServices = require("../../auth/helper/authService");
const bcrypt = require("bcrypt");
var CryptoJS = require("crypto-js");
const models = require("../../../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { ApiError } = require("../../utils/error");

const UserLogin = async (email) => {
  let dbUser = await findUserByEmail(email);
  if (!dbUser) {
    // Create a new User
  } else {
    let user = { name: dbUser.username, id: dbUser.id };
    let refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    let updateTokens = await updateUserRefreshToken(refreshToken);
    if (updateTokens) {
      const dbUserUpdated = await findUserByEmail(email);
      return dbUserUpdated;
    } else {
      return null;
    }
  }
};

const encypttext = (text) => {
  const ciphertext = CryptoJS.AES.encrypt(
    text,
    process.env.ENCRYPTION_KEY_SECRET
  ).toString();
  return ciphertext;
};

const dencypttext = (text) => {
  let bytes = CryptoJS.AES.decrypt(text, process.env.ENCRYPTION_KEY_SECRET);
  let originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

const UserRegister = async (
  username,
  email,
  password,
  country,
  description,
  origin
) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const random = await randomTokenString();

  let roleid = await models.Role.findOne({
    where: {
      name: "user",
    },
  });
  const user = await models.User.create({
    email,
    password: hashPassword,
    verificationToken: random,
    username,
    isVerified: `${process.env.EMAIL_VERIFY}`,
    country,
    description,
    RoleId: roleid.id,
  });

  //if (process.env.ENVIRONMENT == "production") {
  if (user) {
    console.log("Verification email Sending");

    let verificationlink = await authServices.sendVerificationEmail(user);
    if (verificationlink) {
      console.log("verfication email  send");
      return user;
    } else {
      console.log("verfication email not send");
      return false;
    }
  }
  //}
};

const updateUserRefreshToken = async (refreshToken, email) => {
  const updatedUser = models.User.update(
    {
      refreshToken,
    },
    { where: { email } }
  );
  return updatedUser;
};

const findUserByUsername = async (username) => {
  const dbUser = await models.User.findOne({
    where: {
      username: username,
    },
  });
  return dbUser;
};

const findUserByEmail = async (email) => {
  let dbUser = await models.User.findOne({
    where: {
      email: email,
    },
    include: [
      {
        model: models.Role,
      },
      // {
      //   model: models.UserQbank,
      //   //where: { active: true },
      //   // include: [
      //   //   {
      //   //     model: models.QBanks,
      //   //     where: {
      //   //       isactive: true,
      //   //     },
      //   //   },
      //   // ],
      // },
    ],
  });

  return dbUser;
};

const findUserById = async (userid) => {
  const dbUser = await models.User.findOne({
    where: {
      id: userid,
      isActive: true,
    },
  });

  if (dbUser) {
    return dbUser;
  } else {
    throw new ApiError("User Not found with this Id", {
      status: 400,
    });
  }
};

const randomTokenString = async () => {
  return crypto.randomBytes(40).toString("hex");
};

module.exports = {
  UserLogin,
  findUserByEmail,
  encypttext,
  dencypttext,
  findUserById,
  findUserByUsername,
  randomTokenString,
  UserRegister,
};
