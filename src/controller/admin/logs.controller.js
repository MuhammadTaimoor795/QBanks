const { success, errorResponse } = require("../../utils/constants");
const fs = require("fs");
module.exports = {
  // This service is responsible for getting all the system logs from teh database
  getAllSystemLogs: async (req, res, next) => {
    try {
      let serverLog = fs.readFileSync("./logs/logs.log", {
        encoding: "utf8",
        flag: "r",
      });
      let tempArray = new Array();
      const newArray = serverLog.split("};").map((log) => {
        if (log !== "") {
          let str = `"${log.replace(/[^=}{/;:,a-zA-Z0-9]/g, "")}"`;
          const newStr = str.replaceAll("HTML,", "HTML");
          let newlog = JSON.parse(newStr);
          return newlog;
        }
      });
      if (newArray.length > 0) {
        newArray.forEach((element) => {
          const logObject = {};
          // extract key-value pairs from the log string using regex
          const regex = /([A-Za-z]+):([^,]+)/g;
          let match;
          while ((match = regex.exec(element))) {
            logObject[match[1]] = match[2];
          }
          tempArray.push(logObject);
        });
      }
      tempArray.pop(tempArray[tempArray.length - 1]);
      return res.status(201).json(success(tempArray, res.statusCode));
    } catch (error) {
      return res.status(500).json(errorResponse(error.message, res.statusCode));
    }
  },
};
