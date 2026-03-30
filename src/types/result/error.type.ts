export type Error = {
    statusCode: number;
    messages: Record<string, string[]>;
}