import * as z from 'zod';

export interface ValidationErrorToastProps {
    errors: z.ZodIssue[];
}
