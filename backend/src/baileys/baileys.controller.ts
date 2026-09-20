import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post  } from '@nestjs/common';

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
    async startPairing(@Param() param: IdParamDto, @Body() command: CreatePairingCommandDto): Promise<GetPairingCodeResponseDto> {
        const pairingCode = await this.baileysService.startPairing(param.id, command.phone);

        return {
            pairingCode,
        };
    }

    @Post("logout/:id")
    @HttpCode(HttpStatus.NO_CONTENT)
    async logoutSesssion(@Param() param: IdParamDto): Promise<void> {
        await this.baileysService.logoutSession(param.id);
    }

    @Get("status/:id")
    async getStatus(@Param() param: IdParamDto): Promise<GetSessionStatusResponseDto> {
        return this.baileysService.getSessionStatus(param.id);
    }
}
