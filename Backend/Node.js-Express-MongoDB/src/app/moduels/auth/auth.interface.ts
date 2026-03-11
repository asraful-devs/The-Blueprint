export type TLoginPayload = {
    email: string;
    password: string;
};

export type TChangePasswordPayload = {
    oldPassword: string;
    newPassword: string;
};
