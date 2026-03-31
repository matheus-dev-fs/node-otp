export const createOTPCode = (size: number = 6): string => {
    const otp: number[] = Array.from(
        { length: size },
        (): number => Math.floor(Math.random() * 10)
    );

    return otp.join('');
};

export const createOTPExpirationTime = (minutes: number = 5): Date => {
    const expiresAt: Date = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + minutes);
    return expiresAt;
}