import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.id);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(
      req.user.id,
      body.name,
      body.email,
      body.domain,
    );
  }

  @Patch('change-password')
  changePassword(@Req() req: any, @Body() body: any) {
    return this.usersService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Roles(Role.PROJECT_COORDINATOR)
  @Get('interns-monitoring')
  getInternsMonitoring(@Req() req: any, @Query('all') all?: string) {
    const allDomains = all === 'true';
    return this.usersService.getInternsMonitoring(req.user.id, allDomains);
  }

  @Roles(Role.ADMIN)
  @Get('stats')
  getSystemStats() {
    return this.usersService.getSystemStats();
  }

  @Roles(Role.ADMIN, Role.PROJECT_COORDINATOR)
  @Get()
  getAll() {
    return this.usersService.getAll();
  }

  @Roles(Role.ADMIN)
  @Post('bulk')
  bulkCreate(@Body() body: any) {
    return this.usersService.bulkCreate(body.users);
  }

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() body: any) {
    return this.usersService.create(body);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
