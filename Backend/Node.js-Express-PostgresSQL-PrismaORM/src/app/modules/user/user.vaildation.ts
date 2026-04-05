import z from 'zod';
import { IRole } from '../../types';

// Reusable field schemas
const fullNameSchema = z
    .string({ error: 'Name must be a string.' })
    .min(2, { message: 'Name is too short.' })
    .max(50, { message: 'Name is too long.' });

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

const roleSchema = z.enum(Object.values(IRole) as [string], {
    message: 'Invalid role value.',
});

// --- Create User Validation ---
export const createUserZodSchema = z.object({
    fullName: fullNameSchema,
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema,
});

export const updateUserZodSchema = z.object({
    fullName: fullNameSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    role: roleSchema.optional(),
});
