import bcryptjs from 'bcryptjs';
import httpStatus from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { envVars } from '../../config/env';
import AppError from '../../errorHelpers/AppError';
import { createNewAccessTokenWithRefreshToken } from '../../utils/userTokens';
import { User } from '../user/user.model';

// const credentialsLogin = async (payload: Partial<IUser>) => {
//     const { email, password } = payload;
//     const isUserExist = await User.findOne({ email });

//     if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist');
//     }

//     const isPasswordMatched = await bcryptjs.compare(
//         password as string,
//         isUserExist.password as string
//     );

//     if (!isPasswordMatched) {
//         throw new AppError(httpStatus.BAD_REQUEST, 'Incorrect Password');
//     }

//     const userToken = createUserTokens(isUserExist);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: pass, ...rest } = isUserExist.toObject();

//     return {
//         accessToken: userToken.accessToken,
//         refreshToken: userToken.refreshToken,
//         user: rest,
//     };
// };

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(
        refreshToken
    );

    return newAccessToken;
};

const resetPassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload
) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatch = await bcryptjs.compare(
        oldPassword,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        user!.password as string
    );

    if (!isOldPasswordMatch) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Old Password dose not match'
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUNDS)
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    user!.save();
};

export const AuthServices = {
    getNewAccessToken,
    resetPassword,
};
