import type { Error } from "./error.type";

export type InvalidResult = {
    success: false;
    error: Error;
};