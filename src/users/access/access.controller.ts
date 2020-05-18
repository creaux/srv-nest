import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessResponseDto } from './dto/access-response.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UseRoles } from 'nest-access-control/lib';
import { AccessGuard } from './access.guard';
import { ParseNumberPipe } from '../../pipes/parse-number.pipe';
import { Action, Possession } from '@pyxismedia/lib-model';

@Controller('access')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @ApiOperation({ title: 'Get collection of access rights' })
  @ApiResponse({
    status: 200,
    description: 'All access rights have been successfully retrieved.',
  })
  @UseGuards(AuthGuard('bearer'), AccessGuard)
  @UseRoles({
    resource: 'access',
    action: Action.READ,
    possession: Possession.ANY,
  })
  public async findAll(
    @Query('skip', ParseNumberPipe) skip: number,
  ): Promise<AccessResponseDto[]> {
    return await this.accessService.findAll(skip);
  }
}
