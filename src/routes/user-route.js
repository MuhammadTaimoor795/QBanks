const router = require("express").Router();
const auth = require("../middleware/MiddleWareCon");
const { schemas, validationSchema } = require("../middleware/joivalidation");
const {
  validationSchemaQuery,
  newschem,
} = require("../middleware/joivalidationQuery");

/// from User controller

const { upload } = require("../middleware/uploadByMulter");
const {
  registerUserController,
  loginUserController,
  logoutUserController,
  verificationEmail,
  refreshTokens,
  forgotPasswordController,
  resetPasswordController,
  userPasswordUpdate,
  userImgController,
  userProfile,
  userProfileUpdate,
  userQbank,
  userNewTest,
  userQbankTest,
  userPauseTest,
  userResumeTest,
  userEvualateTest,
  userAllTest,
} = require("../controller/user/user-controller");
const {
  joivalidationQueryParams,
  paramsSchema,
} = require("../middleware/joivalidationQueryParams");

router.post(
  "/register",
  validationSchema(schemas.user.create),
  registerUserController
);

router.post(
  "/login",
  validationSchema(schemas.user.login),
  loginUserController
);

router.post("/logout", auth, logoutUserController);

router.post("/token", refreshTokens);

router.get("/verify", verificationEmail);

router.post("/forgetPassword", forgotPasswordController);

router.post(
  "/resetPassword",
  validationSchema(schemas.user.resetPassword),
  resetPasswordController
);

router.post(
  "/changePassword",
  validationSchema(schemas.user.changePassword),
  auth,
  userPasswordUpdate
);

// router.post("/image", auth, upload.single("file"), userImgController);

router.get("/profile", auth, userProfile);

// User All Qbanks
router.get("/qbanks", auth, userQbank);

// All The Test of Qbanks
router.get("/qbanks/:id", auth, userQbankTest);

// router.get(
//   "/qbanks/:id",
//   auth,
//   joivalidationQueryParams(paramsSchema.Qbanks.userbanks),
//   userQbank
// );
router.get(
  "/test",
  auth,
  validationSchemaQuery(newschem.UserTest.getusertest),
  userAllTest
);

router.post("/test", auth, validationSchema(schemas.user.newtest), userNewTest);
router.patch(
  "/test",
  auth,
  validationSchema(schemas.user.pausetest),
  userPauseTest
);

router.get(
  "/test/resume/:usertestid",
  auth,
  joivalidationQueryParams(paramsSchema.User.resumetest),
  userResumeTest
);

router.post(
  "/test/evulate",
  auth,
  validationSchema(schemas.user.evulatetest),
  userEvualateTest
);

// router.patch("/updateProfile", auth, upload.single("file"), userProfileUpdate);

// router.patch("/image", userImgController);
// router.patch("/forgotpassword", forgotPasswordController);

module.exports = router;

//

// tutor mode
// Exam Mode
// => upload test uploading file
// user can attemp many test

// report question

//
