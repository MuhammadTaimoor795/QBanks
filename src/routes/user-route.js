const router = require("express").Router();
const auth = require("../middleware/MiddleWareCon");
const { schemas, validationSchema } = require("../middleware/joivalidation");
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

router.get("/qbanks", auth, userQbank);
// router.get(
//   "/qbanks/:id",
//   auth,
//   joivalidationQueryParams(paramsSchema.Qbanks.userbanks),
//   userQbank
// );

router.post("/test", auth, userNewTest);

// router.patch("/updateProfile", auth, upload.single("file"), userProfileUpdate);

// router.patch("/image", userImgController);
// router.patch("/forgotpassword", forgotPasswordController);

module.exports = router;
