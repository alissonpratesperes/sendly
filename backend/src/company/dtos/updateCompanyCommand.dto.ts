import { PartialType } from '@nestjs/mapped-types';

import { CreateCompanyCommandDto } from './createCompanyCommand.dto';

export class UpdateCompanyCommandDto extends PartialType(CreateCompanyCommandDto) {}
