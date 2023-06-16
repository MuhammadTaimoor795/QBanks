const models = require("../../../models/index");
const { Op } = require("sequelize");
const db = require("../../../models/index");
const { ApiError } = require("../../utils/error");
const { TestStatus, StudentMode } = require("../../utils/constants");

async function findQbanksByid(id) {
  let qbank = await models.QBanks.findOne({
    where: {
      id,
      isactive: true,
    },
  });

  if (!qbank) {
    throw new ApiError("Qbank Not Found with this is Id Or Blocked By Admin", {
      status: 400,
    });
  } else {
    console.log("yes qbanks found");
    return qbank;
  }
}

async function VerifyUserQbanks(userId, qbankid) {
  let qbank = await models.UserQbank.findOne({
    where: {
      UserId: userId,
      QBankId: qbankid,
      active: true,
    },
  });

  if (!qbank) {
    return false;
    // throw new ApiError("This Qbanks is not Assign to you ", {
    //   status: 400,
    // });
  } else {
    return true;
  }
}

async function qbanksTests(qbankid) {
  let tests = await models.Test.findAll({
    where: {
      QBankId: qbankid,
      isactive: true,
    },
  });

  if (tests.length <= 0) {
    throw new ApiError("There are no test availble ", {
      status: 400,
    });
  } else {
    return tests;
  }
}

// async function findUserByEmail(email) {
//   email = email.toLowerCase();
//   let dbUser = await models.User.findOne({
//     where: {
//       email: email,
//     },
//   });
//   return dbUser;
// }

async function findUsertestById(testid, userid) {
  let test = await models.Test.findOne({
    where: {
      id: testid,
    },
  });

  if (!test) {
    throw new ApiError(`test Not Found with this is ${testid}`, {
      status: 404,
    });
  }
  // veifty this test is in Qbanks
  let qbank = await VerifyUserQbanks(userid, test.QBankId);

  if (!qbank) {
    throw new ApiError("This Test is not include in your Qbanks ", {
      status: 400,
    });
  }
  // if invalid id

  // if test is not active
  if (test.isactive === false) {
    throw new ApiError(`This test is blocked by Admin`, {
      status: 404,
    });
  }

  // check if the test is already incomplete

  let usertest = true; //await checkAlreadyTest(testid, userid);
  if (test && qbank && usertest) {
    return true;
  }
}

async function checkAlreadyTest(testid, userid) {
  let usertest = await models.UserTest.findOne({
    where: {
      UserId: userid,
      TestId: testid,
      status: TestStatus.INCOMPLETED,
    },
  });

  if (usertest) {
    throw new ApiError(`First Complete the Previous `, {
      status: 404,
    });
  } else {
    return true;
  }
}

async function usernewTest(userid, testid, duration, mode) {
  console.log("Test");
  console.table({ testid, userid, duration, mode });
  let usertest = await models.UserTest.create({
    UserId: userid,
    TestId: testid,
    duration,
    mode,
  });

  console.log("Test created", usertest.id);
  let questions = await models.Question.findAll({
    where: {
      TestId: testid,
      isactive: true,
    },
  });
  console.log("questions", questions);
  for (let question of questions) {
    let createResponse = await models.UserResponse.create({
      UserTestId: usertest.id,
      QuestionId: question.id,
    });
  }

  let userquestions = await getUserTestQuestions(usertest.id);
  if (userquestions) {
    return userquestions;
  }
}

async function getUserTestQuestions(id) {
  let userquestions = await models.UserResponse.findAll({
    where: {
      UserTestId: id,
    },
    include: [
      {
        model: models.Question,
        include: [
          {
            model: models.Option,
          },
        ],
      },
    ],
  });
  if (userquestions) {
    let question = await usertestformat(userquestions);
    if (question) {
      return question;
    }
    //return userquestions;
  } else {
    throw new ApiError(`Invalid Test id`, {
      status: 404,
    });
  }
}

async function usertestformat(test) {
  let question = [];
  for (let item of test) {
    let obj = {};

    obj.uuid = item.id;
    obj.isCorrect = item.isCorrect;
    obj.questionId = item.Question.id;
    obj.question = item.Question.description;
    obj.explanation = item.Question.explanation;

    let options = [];
    for (let option of item.Question.Options) {
      let newobj = {};
      newobj.id = option.id;
      newobj.name = option.name;
      newobj.istrue = option.istrue;

      options.push(newobj);
    }
    obj.options = options;

    question.push(obj);
  }

  return question;
}
async function userpauseTest(userid, usertestid, timeleft) {
  let pausetest = await models.UserTest.update(
    {
      status: TestStatus.PAUSE,
      remainingDuration: timeleft,
    },
    {
      where: {
        UserId: userid,
        id: usertestid,
      },
    }
  );

  if (pausetest) {
    return true;
  }
}
async function userresumeTest(userid, usertestid) {
  let userquestions = await getUserTestQuestions(usertestid);
  if (userquestions) {
    return userquestions;
  }
}

async function userallTest(userid, query) {
  const where = {};
  where.UserId = userid;
  if (query !== "ALL") {
    where.status = query;
  }

  let usertest = await models.UserTest.findAll({
    where,
  });
  if (usertest) {
    return usertest;
  }
}

async function userevulateTest(reponseid, istrue, optionid) {
  // find questions
  let userquestion = await models.UserResponse.findOne({
    where: {
      id: reponseid,
    },
  });
  console.log("Data", userquestion.id);

  // check if user is already answer

  let useroption = await models.UserResponseOptions.findAll({
    where: {
      UserResponseId: userquestion.id,
    },
  });

  console.log("user option s", useroption);

  // for update
  if (useroption.length > 0) {
    let deleteres = await models.UserResponseOptions.destroy({
      where: {
        UserResponseId: userquestion.id,
      },
    });

    if (!deleteres) {
      throw new ApiError("Error in deleting Response", { status: 500 });
    }
  }
  // update is true or not

  let updateresponse = await models.UserResponse.update(
    {
      isCorrect: istrue,
    },
    {
      where: {
        id: reponseid,
      },
    }
  );

  if (updateresponse) {
    for (let option of optionid) {
      let useroption = await models.UserResponseOptions.create({
        UserResponseId: userquestion.id,
        OptionId: option,
      });
    }
  }
  if (updateresponse) {
    return true;
  }

  // let userquestions = await getUserTestQuestions(usertestid);
  // if (userquestions) {
  //   return userquestions;
  // }
}

async function usercompleteTest(userid, usertestid) {
  let completetest = await models.UserTest.update(
    {
      status: TestStatus.COMPLETED,
    },
    {
      where: {
        UserId: userid,
        id: usertestid,
      },
    }
  );

  let report = await models.UserTest.findOne({
    where: {
      UserId: userid,
      id: usertestid,
    },
    include: [
      {
        model: models.UserResponse,
        include: [
          {
            model: models.Question,
          },
          {
            model: models.UserResponseOptions,
            include: [
              {
                model: models.Option,
              },
            ],
          },
        ],
      },
    ],
  });

  let obj = {
    usertestid: report.id,
    status: report.status,
    duration: report.duration,
    completeDuration: report.completeDuration,
    remainingDuration: report.remainingDuration,
    mode: report.mode,
    questons: await transformUserResponses(report.UserResponses, report.mode),
  };
  if (report) {
    return obj;
  }
  //return report;
}
function transformUserResponses(UserResponses, mode) {
  return UserResponses.map((userResponse) => {
    const {
      id: uuid,
      QuestionId: questionId,
      Question: { description: question, explanation },
      UserResponseOptions,
    } = userResponse;

    const userOptions = UserResponseOptions.map((userOption) => {
      const {
        OptionId: optionId,
        Option: { name: description },
      } = userOption;
      return { optionId, description };
    });

    const userResponseObject = {
      uuid,
      questionId,
      question,
      useroptions: userOptions,
    };

    if (mode == StudentMode.TUTOR) {
      userResponseObject.explanation = explanation;
    }

    return userResponseObject;
  });
}

async function userAllqbanks(id) {
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

  let data = await transformUserQbanks(user.UserQbanks);

  for (let qbank of data) {
    for (let test of qbank.Tests) {
      let findtest = await models.UserTest.findOne({
        where: {
          TestId: test.id,
        },
      });
      if (findtest) {
        test.status = findtest.status;
      }
    }
  }

  if (user) {
    return data;
  }
}
function transformUserQbanks(UserQbanks) {
  return UserQbanks.map((userQbank) => {
    const {
      id,
      QBankId,
      QBank: { name: QBankName, description: QBankDesc, Tests },
    } = userQbank;

    const transformedTests = Tests.map((test) => {
      const { id, name, description } = test;
      return { id, name, description };
    });

    const transformedData = {
      id,
      QBankId,
      QBankName,
      QBankDesc,
      Tests: transformedTests,
    };

    return transformedData;
  });
}

module.exports = {
  findQbanksByid,
  VerifyUserQbanks,
  qbanksTests,
  findUsertestById,
  usernewTest,
  userpauseTest,
  userresumeTest,
  userevulateTest,
  userallTest,
  usercompleteTest,
  userAllqbanks,
};
