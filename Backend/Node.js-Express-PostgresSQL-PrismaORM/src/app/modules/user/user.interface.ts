import type { IRole } from '../../types';

interface IUser {
    id: string;
    fullName: string;
    email: string;
    password: string;
    role: IRole;
}
