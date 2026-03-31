export type LogContext = {
    service?: string;
    requestId?: string;
    userId?: number;
    [key: string]: unknown;
};