/* eslint-disable @typescript-eslint/no-unsafe-argument */
import util from "util";
import { createLogger, format, transports } from "winston";
import type { ConsoleTransportInstance, FileTransportInstance } from "winston/lib/winston/transports";
import path from "node:path";
import { red, yellow, green, magenta } from "colorette";
import { ENV } from "../config/config";

const getCurrentTimestamp = () => {
  return new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString("en-US");
};

const colorizeLevel = (level: string) => {
  switch (level) {
    case "ERROR":
      return red(level);
    case "INFO":
      return green(level);
    case "WARN":
      return yellow(level);
    default:
      return level;
  }
};

const consoleLogFormat = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { level, message, meta } = info;

  const customLevel = colorizeLevel(level.toUpperCase());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const customMessage = message;
  const customMeta = util.inspect(meta, {
    showHidden: true,
    depth: 1,
    colors: true,
  });

  // Use the timestamp function here
  const timestamp = getCurrentTimestamp();

  const customLog = `
-------------------------------------------------------------------------------
  ${customLevel}::${customMessage} \n  ${yellow("TIMESTAMP")} [${green(timestamp)}] \n  ${magenta("META")}: ${customMeta}
-------------------------------------------------------------------------------
`;

  return customLog;
});

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if (ENV === "DEVELOPMENT") {
    return [
      new transports.Console({
        level: "info",
        format: format.combine(format.timestamp(), consoleLogFormat)
      })
    ];
  }

  return [];
};

const fileLogFormat = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { level, message, meta = {} } = info;

  const logMeta: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || ""
      };
    } else {
      logMeta[key] = value;
    }
  }

  // Use the timestamp function here as well
  const logData = {
    level: level.toUpperCase(),

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    message,
    customTimestamp: getCurrentTimestamp(),
    meta: logMeta
  };

  return JSON.stringify(logData, null, 4);
});

const FileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, "../../", "logs", `${ENV}.log`),
      level: "info",
      format: format.combine(format.timestamp(), fileLogFormat)
    })
  ];
};

const logger = createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...FileTransport(), ...consoleTransport()]
});

export default logger;
