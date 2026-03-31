import type { LogContext } from "../types/log/log-context.type";
import type { LogLevel } from "../types/log/log-level.type";

const baseLog = (level: LogLevel, event: string, context: LogContext = {}): void => {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        event,
        ...context,
    };

    console[level === "error" ? "error" : "log"](JSON.stringify(entry));
};

export const logger = {
    info: (event: string, context?: LogContext) => baseLog("info", event, context),
    warn: (event: string, context?: LogContext) => baseLog("warn", event, context),
    error: (event: string, context?: LogContext) => baseLog("error", event, context),
};