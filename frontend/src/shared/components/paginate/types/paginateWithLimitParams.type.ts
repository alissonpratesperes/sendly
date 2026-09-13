import { PaginateParams } from './paginateParams.type';

export type PaginateWithLimitParams = PaginateParams & {
    updateLimit: (limit: number) => void;
}
