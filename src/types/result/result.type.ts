import type { InvalidResult } from "./invalid-result.type";
import type { ValidResult } from "./valid-result.type";

export type Result<T> = InvalidResult | ValidResult<T>;