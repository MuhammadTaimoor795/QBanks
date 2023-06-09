require("dotenv");
const db = require("../../../models");
const crypto = require("crypto");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const { ApiError } = require("../../utils/error");

const config = require("../config.json");

const authenticate = async ({ uuid, password, ipAddress }) => {
  const user = await db.User.findOne({
    where: {
      uuid: uuid,
    },
  });
  // authentication successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);

  const refreshToken = await generateRefreshToken(user.id, ipAddress);
  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
};

const refreshToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);
  const { userId } = refreshToken;
  console.log("1", userId);
  // replace old refresh token with a new one and save
  const newRefreshToken = await generateRefreshToken(userId, ipAddress);

  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  refreshToken.userId = userId;
  // console.log("radaf", refreshToken);
  const dadad = await db.RefreshToken.create({
    // expires: JSON.stringify(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    revoked: Date.now(),
    revokedByIp: ipAddress,
    replacedByToken: newRefreshToken.token,
    userId: userId,
    token: refreshToken.token,
    isActive: true,
  });
  // generate new jwt
  const user = await db.User.findOne({
    where: { id: userId },
  });

  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
};

const revokeToken = async ({ token, ipAddress }) => {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.isActive = false;
  refreshToken.isExpired = true;

  const data = await db.RefreshToken.update(refreshToken, {
    where: {
      token,
    },
  });

  return data;
};

const getAll = async () => {
  const users = await db.User.findAll();
  return users.map((x) => basicDetails(x));
};

const getById = async (id) => {
  const user = await getUser(id);
  return basicDetails(user);
};

const getRefreshTokens = async (userId) => {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await db.RefreshToken.find({ where: { id: userId } });
  return refreshTokens;
};

// helper functions

const getUser = async (id) => {
  if (!db.isValidId(id)) throw "User not found";
  const user = await db.User.findOne({
    where: {
      id,
    },
  });
  if (!user) throw "User not found";
  return user;
};

const getRefreshToken = async (token) => {
  const refreshToken = await db.RefreshToken.findOne({ where: { token } });
  console.log("adfa", refreshToken);
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";
  return refreshToken;
};

// generate new jwt token
const generateJwtToken = (user) => {
  console.log("gf", process.env.JWT_SECRET);
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.uuid, id: user.uuid }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// generate refresh token
const generateRefreshToken = async (userId, ipAddress) => {
  // create a refresh token that expires in 7 days
  // const user = db.User.findOne({where:{
  //   id: userId
  // }})
  const refreshData = await db.RefreshToken.create({
    userId: userId,
    expires: JSON.stringify(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)),
    token: crypto.randomBytes(40).toString("hex"),
    createdByIP: ipAddress,
    isActive: true,
  });
  // console.log("refresHdata", refreshData);
  return refreshData;
};

const randomTokenString = async () => {
  return crypto.randomBytes(40).toString("hex");
};

const setTokenCookie = (res, token) => {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
};

// get basic details.
const basicDetails = (user) => {
  const { uuid, firstName, lastName, email, role, jwtToken, refreshToken } =
    user;
  return { uuid, firstName, lastName, email, role, jwtToken, refreshToken };
};

const forgotPassword = async ({ email }, origin) => {
  const account = await db.User.findOne({ where: { email } });
  // always return ok response to prevent email enumeration
  if (!account) return;

  // create reset token that expires after 24 hours
  account.resetToken = (await randomTokenString()).toString();
  account.resetTokenExpires = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toDateString();

  const update = await db.User.update(
    {
      resetToken: account.resetToken,
      resetTokenExpires: account.resetTokenExpires,
    },
    {
      where: { id: account.id },
    }
  );
  console.log("update", account);
  // send email
  await sendPasswordResetEmail(account, origin);
};

async function validateResetToken({ token }) {
  const account = await db.Account.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: Date.now() },
    },
  });

  if (!account) throw "Invalid token";

  return account;
}
async function resetPassword({ token, password }) {
  const account = await validateResetToken({ token });

  // update password and remove reset token
  account.passwordHash = await hash(password);
  account.passwordReset = Date.now();
  account.resetToken = null;

  const update = await db.User.update(
    {
      passwordHash: account.passwordHash,
      passwordReset: account.passwordReset,
      resetToken: null,
    },
    {
      where: { id: account.id },
    }
  );
}

async function sendPasswordResetEmail(account, origin) {
  let message;
  if (origin) {
    const resetUrl = `${origin}/reset-password?token=${account.resetToken}`;
    message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                   <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to reset your password with the <code>/account/reset-password</code> api route:</p>
                   <p><code>${account.resetToken}</code></p>`;
  }

  await sendEmail({
    to: account.email,
    subject: "Enter the Sphere - Reset Password",
    html: `<h4>Reset Password Email</h4>
               ${message}`,
  });
}

const sendEmail = async ({ to, subject, html, from = config.emailFrom }) => {
  console.log("form", from);

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    //host: "smtp.gmail.com",
    // port: 587,
    auth: {
      user: "muhammadtaimoor049@gmail.com",
      pass: "jycyloeyhxmhewfz",
    },
  });
  //    console.log("transpor,", transporter);

  // // Send email
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.error(error);
  //   } else {
  //     console.log("Email sent: " + info.response);
  //   }
  // });

  let data = await transporter.sendMail({ from, to, subject, html });
  if (data) {
    return true;
  }
};

async function sendVerificationEmail(account) {
  try {
    let message;
    const verifyUrl = `${process.env.origin}/user/verify?token=${account.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
    console.log("MEssage", message);
    let sendmail = await sendEmail({
      to: account.email,
      subject: "Sign-up Verification API - Verify Email",
      html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
    });
    if (sendmail) {
      return true;
    }
  } catch (error) {
    console.log("ERRROR", error);
  }
}

async function verifyEmail({ token }) {
  const account = await db.User.findOne({
    where: { verificationToken: token },
  });

  if (!account) throw "Verification failed";

  account.verified = Date.now();
  account.verificationToken = null;

  const update = await db.User.update(
    {
      verificationToken: account.verificationToken,
    },
    {
      where: {
        id: account.id,
      },
    }
  );
}

const sendVerificationEmailForgetPassword = async (email) => {
  console.log("email forget password : : : ", email);
  const randomTokenString = async () => {
    return crypto.randomBytes(40).toString("hex");
  };
  const randomToken = await randomTokenString();
  const userExist = await db.User.findOne({ where: { email: email } });

  if (userExist.toString != 0) {
    console.log("one :", randomToken);
    await db.User.update(
      { verificationToken: randomToken },
      { where: { email } }
    );
    let message = `${process.env.origin}/user/resetPassword?resetToken=${randomToken}`;
    console.log("one");
    await sendEmail({
      to: email,
      subject: "Forget Password Verfication Mail",
      html: `<h4>Verify Email</h4>
               ${message}`,
    });
    return true;
  } else {
    return false;
  }
};

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens,
  setTokenCookie,
  randomTokenString,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendVerificationEmailForgetPassword,
};
