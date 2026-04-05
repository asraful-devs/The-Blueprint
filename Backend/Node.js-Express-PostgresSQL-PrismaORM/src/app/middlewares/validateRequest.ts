import { type NextFunction, type Request, type Response } from 'express';
import type { ZodObject } from 'zod';

const vaildateRequest =
    (schema: ZodObject) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await schema.parseAsync(req.body);
            req.body = result;
            next();
        } catch (error) {
            next(error);
        }
    };

export default vaildateRequest;
