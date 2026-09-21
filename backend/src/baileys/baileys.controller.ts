import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post  } from '@nestjs/common';

import { BaileysService } from './baileys.service';
import { IdParamDto } from '../common/dtos/idParam.dto';
import { GetSessionStatusResponseDto } from './dtos/getBaileysStatus.dto';
import { CreatePairingCommandDto } from './dtos/createPairingCodeCommand.dto';
import { GetPairingCodeResponseDto } from './dtos/getPairingCodeResponse.dto';

@Controller("baileys")
export class BaileysController {
    constructor(
        private readonly baileysService: BaileysService,
    ) {}

    @Post("pair/:id")
    @HttpCode(HttpStatus.OK)
    async pair(@Param() param: IdParamDto, @Body() command: CreatePairingCommandDto): Promise<GetPairingCodeResponseDto> {
        const pairingCode = await this.baileysService.pair(param.id, command.phone);

        return {
            pairingCode,
        };
    }

    @Get("status/:id")
    async status(@Param() param: IdParamDto): Promise<GetSessionStatusResponseDto> {
        return this.baileysService.status(param.id);
    }

    @Delete("logout/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logout(@Param() param: IdParamDto): Promise<void> {
        await this.baileysService.logout(param.id);
    }
}
