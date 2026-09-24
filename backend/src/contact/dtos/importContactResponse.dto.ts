import { ImportContactErrorDto } from './importContactError.dto';

export class ImportContactResponseDto {
    constructor(
        public total: number,
        public valid: number,
        public invalid: number,
        public errors: ImportContactErrorDto[],
    ) {}
}
