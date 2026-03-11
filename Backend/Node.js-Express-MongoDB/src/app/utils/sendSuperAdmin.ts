import bcryptjs from 'bcryptjs';
import { envVars } from '../config/env.js';

export const sendSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({
            email: envVars.SUPER_ADMIN_EMAIL,
        });

        if (isSuperAdminExist) {
            console.log('Super Admin Already Exists!!');
            return;
        }

        const hashedPassword = await bcryptjs.hash(
            envVars.SUPER_ADMIN_PASSWORD as string,
            Number(envVars.BCRYPT_SALT_ROUNDS)
        );

        const payload = {
            name: 'Super Admin',
            role: Role.SUPER_ADMIN,
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            isValid: true,
        };

        const superAdmin = await User.create(payload);
        console.log(superAdmin);
    } catch (error) {
        console.log(error);
    }
};
