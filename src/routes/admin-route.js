const router = require("express").Router();
const auth = require("../middleware/MiddleWareCon");
const adminCheck = require("../middleware/adminCheck");
const { validationSchema, schemas } = require("../middleware/joivalidation");
const multer = require("multer");
const upload = multer();
// User Routes *****************************************************************************************************

const {
  getAllUsers,
  getUser,
  UnBlockUser,
  BlockUser,
  ActiveUser,
} = require("../controller/admin/user.controller");

const { getAllSystemLogs } = require("../controller/admin/logs.controller");
const {
  CreateQanks,
  AllQBanks,
  FindByIdQBanks,
  UnlockQBanks,
  LockQBanks,
  AddQBanksToUser,
  RemoveQBanksToUser,
  QBanksUser,
  QBanksUserAdmin,
} = require("../controller/admin/qbanks.controller");
const {
  AdminCreateTest,
  AdminQBanksTest,
  AdminFindTest,
  AdminLockTest,
  AdminUnlockTest,
  AdminUpdateTest,
  AdminAddTestyFile,
} = require("../controller/admin/admin.test.controller");
const {
  AdminAddQuestion,
  AdminTestQuestion,
  AdminFindQuestion,
  AdminLockQuestion,
  AdminUnLockQuestion,
  AdminUpdateQuestion,
} = require("../controller/admin/admin.question.controller");
const {
  AdminAddOption,
  AdminUpdateOption,
  AdminLockOption,
  AdminUnLockOption,
} = require("../controller/admin/admin.option.controller");
const {
  validationSchemaQuery,
  newschem,
} = require("../middleware/joivalidationQuery");

// Users
router.get("/users", adminCheck, getAllUsers);

router.get("/users/:id", adminCheck, getUser);
router.patch("/users/unblock/:id", adminCheck, UnBlockUser);
router.patch("/users/block/:id", adminCheck, BlockUser);
router.patch("/users/active/:id", adminCheck, ActiveUser);

// Qbanks
router.post(
  "/qbank",
  adminCheck,
  validationSchema(schemas.Qbanks.create),
  CreateQanks
);

router.get("/qbank", adminCheck, AllQBanks);
router.get("/qbank/:id", adminCheck, FindByIdQBanks);
router.patch("/qbank/unblock/:id", adminCheck, UnlockQBanks);
router.patch("/qbank/block/:id", adminCheck, LockQBanks);
// router.post("/qbank/user/add", adminCheck, AddQBanksToUser);

// Test
router.post(
  "/test",
  adminCheck,
  validationSchema(schemas.Test.create),
  AdminCreateTest
);

// router.post("/test/upload", upload.single("file"), AdminAddTestyFile2);

router.post(
  "/test/bulk",
  // adminCheck,
  validationSchema(schemas.Test.bulkcreate),
  AdminAddTestyFile
);

router.get("/test", adminCheck, AdminQBanksTest);
router.get("/test/:id", adminCheck, AdminFindTest);
router.patch("/test/block/:id", adminCheck, AdminLockTest);
router.patch("/test/unblock/:id", adminCheck, AdminUnlockTest);
router.patch(
  "/test",
  adminCheck,
  validationSchema(schemas.Test.update),
  AdminUpdateTest
);

// Questionsx
router.post(
  "/question",
  adminCheck,
  validationSchema(schemas.Question.create),
  AdminAddQuestion
);

router.get("/question", adminCheck, AdminTestQuestion);
router.get("/question/:id", adminCheck, AdminFindQuestion);
router.patch("/question/block/:id", adminCheck, AdminLockQuestion);
router.patch("/question/unblock/:id", adminCheck, AdminUnLockQuestion);
router.patch(
  "/question",
  adminCheck,
  validationSchema(schemas.Question.update),
  AdminUpdateQuestion
);

router.post(
  "/option",
  adminCheck,
  validationSchema(schemas.Option.create),
  AdminAddOption
);

router.get("/option", adminCheck, AdminTestQuestion);
router.get("/option/:id", adminCheck, AdminAddOption);
router.patch("/option/block/:id", adminCheck, AdminLockOption);
router.patch("/option/unblock/:id", adminCheck, AdminUnLockOption);
router.patch(
  "/option",
  adminCheck,
  validationSchema(schemas.Option.update),
  AdminUpdateOption
);

/// Assgin Qbanks to User
router.post(
  "/qbank/user",
  adminCheck,
  validationSchema(schemas.Qbanks.user),
  AddQBanksToUser
);

router.patch(
  "/qbank/user",
  adminCheck,
  validationSchema(schemas.Qbanks.user),
  RemoveQBanksToUser
);

router.get(
  "/qbank/user/get",
  adminCheck,
  validationSchemaQuery(newschem.Qbanks.userbanks),
  QBanksUserAdmin
);

// Options

// /// old
// router.get("/users", adminCheck, getAllUsers);
// router.get("/logs", auth, adminCheck, getAllSystemLogs);

// router.get("/adminDashboardDetails", auth, adminCheck, getDashboardDetails);

// router.get("/user/:userId", auth, adminCheck, getUser);

// router.post("/users/token", auth, adminCheck, refreshTokens);

// // Permission Routes *****************************************************************************************************

// const {
//   createPermission,
//   getAllPermission,
//   getPermission,
//   updatePermission,
//   deletePermission,
// } = require("../controller/admin/permission.controller");

// router.post("/permission/create", auth, adminCheck, createPermission);

// router.get("/permissions", auth, adminCheck, getAllPermission);

// router.get("/permissions/:permissionId", auth, adminCheck, getPermission);

// router.patch(
//   "/permission/update/:permissionId",
//   auth,
//   adminCheck,
//   updatePermission
// );

// router.delete(
//   "/permission/delete/:permissionId",
//   auth,
//   adminCheck,
//   deletePermission
// );

// const {
//   create_ticket,
//   get_all_tickets,
//   get_ticket,
//   get_user_tickets,
//   delete_ticket,
//   create_chat_by_user,
//   create_chat_by_administration,
//   get_user_details_of_tickets,
// } = require("../controller/admin/support.controller");
// const { CreateQanks } = require("../controller/admin/qbanks.controller");

// router.post(
//   "/support/create",
//   // validationSchema(schemas.support.create),
//   auth,
//   create_ticket
// );

// router.get("/support", auth, adminCheck, get_all_tickets);

// router.get("/support/:Ticket", auth, adminCheck, get_ticket);

// router.get("/user/support/:userId", auth, adminCheck, get_user_tickets);

// router.delete("/support/delete/:questionId", auth, adminCheck, delete_ticket);

// router.post(
//   "/support/chatByUser/:TicketId",
//   // validationSchema(schemas.support.update),
//   auth,
//   create_chat_by_user
// );

// router.get(
//   "/ticketDetailUser/:UserId",
//   auth,
//   adminCheck,
//   get_user_details_of_tickets
// );

module.exports = router;
