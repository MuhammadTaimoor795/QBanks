const { createLogger, format, transports } = require("winston");
const { Socket } = require("../utils/socket");
const myFormat = format.printf(({ level, timestamp, message, meta }) => {
  Socket.send(
    "log",
    `{"Time": "${timestamp}","Status": "${
      meta.res.statusCode
    }","ResponseTime": "${meta.responseTime}","Method": "${
      meta.req.method
    }","BaseUrl": "${process.env.SERVER_PATH + meta.req.url}","Host": "${
      meta.req.headers["host"]
    }","RequestFrom": "${meta.req.headers["user-agent"]}"};`
  );
  return `{"id":"","Time": "${timestamp}","Status": "${
    meta.res.statusCode
  }","ResponseTime": "${meta.responseTime}","Method": "${
    meta.req.method
  }","BaseUrl": "${process.env.SERVER_PATH + meta.req.url}","Host": "${
    meta.req.headers["host"]
  }","RequestFrom": "${meta.req.headers["user-agent"]}"};`;
});

const Logging = createLogger({
  transports: [
    new transports.File({
      level: "info",
      filename: "./logs/Logs.log",
    }),
  ],

  format: format.combine(format.json(), format.timestamp(), myFormat),
  statusLevels: true,
});

module.exports = { Logging };
