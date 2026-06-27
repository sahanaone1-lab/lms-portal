import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DomainsService } from './domains.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('domains')
export class DomainsController {
  constructor(private domainsService: DomainsService) {}

  @Get()
  getAll(@Query('all') all?: string) {
    const isAll = all === 'true';
    return this.domainsService.getAll(isAll);
  }

  @Roles(Role.ADMIN)
  @Get('stats')
  getStats() {
    return this.domainsService.getStats();
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.domainsService.create(body.name, body.description);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; isActive?: boolean },
  ) {
    return this.domainsService.update(id, body);
  }
}
