import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('contact')
  async submitContact(@Body() contactData: { name: string; email: string; message: string }) {
    return this.prisma.contactMessage.create({
      data: {
        name: contactData.name,
        email: contactData.email,
        message: contactData.message,
      },
    });
  }
}
