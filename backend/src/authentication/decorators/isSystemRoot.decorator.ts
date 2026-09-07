import { SetMetadata } from '@nestjs/common';

export const IS_SYSTEM_ROOT_KEY = "IsSystemRoot";

export const IsSystemRoot = () => SetMetadata(IS_SYSTEM_ROOT_KEY, true);
