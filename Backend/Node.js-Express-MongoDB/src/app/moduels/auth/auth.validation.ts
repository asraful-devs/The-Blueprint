import z from 'zod';

const emailSchema = z
    .string({ error: 'Email must be a string.' })
    .email({ message: 'Invalid email address format.' })
    .min(5, { message: 'Email must be at least 5 characters long.' })
    .max(100, { message: 'Email is too long.' });

const passwordSchema = z
    .string({ error: 'Password must be a string.' })
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[A-Z]/, { message: 'Must include at least one uppercase letter.' })
    .regex(/[a-z]/, { message: 'Must include at least one lowercase letter.' })
    .regex(/[0-9]/, { message: 'Must include at least one number.' })
    .regex(/[@$!%*?&]/, {
        message: 'Must include at least one special character.',
    });

export const loginPayloadSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const changePasswordPayloadSchema = z.object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
});

export const AuthValidation = {
    loginPayloadValidationSchema: loginPayloadSchema,
    changePasswordPayloadValidationSchema: changePasswordPayloadSchema,
};
