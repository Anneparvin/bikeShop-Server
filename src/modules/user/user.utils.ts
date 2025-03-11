

import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
    jwtPayload: {
        userEmail: string;
        role: string,
        userId: string
    },
    secret: Secret,
    expiresIn: string | number
) => {
    const options: SignOptions = { expiresIn: expiresIn as SignOptions['expiresIn'] };

    return jwt.sign(jwtPayload, secret, options);
};


