import type { RequestHandler } from "express";
import * as authValidators from "../validators/schema.validator";
import * as userService from "../services/user.service";
import * as otpService from "../services/otp.service";
import type { Email } from "../types/email.type";
import type { Result } from "../types/result/result.type";
import type { PublicUser } from "../types/public-user.type";
import type { Otp } from "../generated/prisma/client";
import { sendEmail } from "../libs/mailtrap.lib";
import type { NameAndEmail } from "../types/name-and-email.type";

export const signin: RequestHandler = async (req, res): Promise<void> => {
    const reqValidationResult: Result<Email> = authValidators.signIn(req);

    if (!reqValidationResult.success) {
        res.status(reqValidationResult.error.statusCode).json(reqValidationResult.error.messages);
        return;
    }

    const email: string = reqValidationResult.data.email;
    const userResult: Result<PublicUser> = await userService.getUserByEmail(email);

    if (!userResult.success) {
        res.status(userResult.error.statusCode).json(userResult.error.messages);
        return;
    }

    const user: PublicUser = userResult.data;
    const otpResult: Result<Otp> = await otpService.generateOTP(user.id);

    if (!otpResult.success) {
        res.status(otpResult.error.statusCode).json(otpResult.error.messages);
        return;
    }

    const otp: Otp = otpResult.data;

    const sendEmailResult: Result<boolean> = await sendEmail(
        user.email, 
        "Código de verificação", 
        `Seu código de verificação é: ${otp.code}`
    );

    if (!sendEmailResult.success) {
        res.status(sendEmailResult.error.statusCode).json(sendEmailResult.error.messages);
        return;
    }

    res.status(200).json({ id: otp.id });
};

export const signup: RequestHandler = async (req, res): Promise<void> => {
    const reqValidationResult: Result<NameAndEmail> = authValidators.signUp(req);

    if (!reqValidationResult.success) {
        res.status(reqValidationResult.error.statusCode).json(reqValidationResult.error.messages);
        return;
    }

    const { name, email }: NameAndEmail = reqValidationResult.data;
    const userResult: Result<PublicUser> = await userService.getUserByEmail(email);

    if (userResult.success) {
        res.status(400).json({ email: ["O email já está em uso"] });
        return;
    }

    if (!userResult.success && userResult.error.statusCode !== 404) {
        res.status(userResult.error.statusCode).json(userResult.error.messages);
        return;
    }

    const createUserResult: Result<PublicUser> = await userService.createUser(name, email);

    if (!createUserResult.success) {
        res.status(createUserResult.error.statusCode).json(createUserResult.error.messages);
        return;
    }

    const user: PublicUser = createUserResult.data;
    res.status(201).json(user);
}