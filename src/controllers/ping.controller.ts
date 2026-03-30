import { type RequestHandler } from "express";

export const ping: RequestHandler = (req, res): void => {
    res.status(200).json({ message: "pong" });
};