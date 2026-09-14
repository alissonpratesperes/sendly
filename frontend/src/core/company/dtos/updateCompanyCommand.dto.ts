import { CreateCompanyCommandDto } from './createCompanyCommand.dto';

export interface UpdateCompanyCommandDto extends Partial<CreateCompanyCommandDto> { }
