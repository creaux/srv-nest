import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccessService } from './access.service';
import { AccessCollectionRequestDto } from './dto/access-collection-request.dto';
import { AccessResponseDto } from './dto/access-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('access')
@ApiBearerAuth()
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Get()
  @UseGuards(AuthGuard('bearer'))
  public async findAll(): Promise<AccessResponseDto[]> {
    return await this.accessService.findAll();
  }
}
