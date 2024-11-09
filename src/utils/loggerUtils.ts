/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

  // Use JSON.stringify to handle nested objects and avoid [object Object] output
  const customMeta = JSON.stringify(meta, null, 2); // Adjust depth here if needed for more nested details

  const timestamp = getCurrentTimestamp();

  const customLog = `
-------------------------------------------------------------------------------
  ${customLevel}::${customMessage} 
  ${yellow("TIMESTAMP")} [${green(timestamp)}] 
  ${magenta("META")}: ${customMeta}
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
