import { ImportContactErrorDto } from './importContactError.dto';

export interface ImportContactResponseDto {
    total: number;
    valid: number;
    invalid: number;

    errors: ImportContactErrorDto[];
}
