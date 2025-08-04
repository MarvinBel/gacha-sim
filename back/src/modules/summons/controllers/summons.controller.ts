import { Controller, Get, Post, Body, Delete, UseGuards, Request, Put } from '@nestjs/common';
import { SummonsService } from '../services/summons.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateSummonDto } from '../dto/summon.dto';

@Controller('summons')
@UseGuards(JwtAuthGuard)
export class SummonsController {
  constructor(private readonly summonsService: SummonsService) {}

  @Get()
  async getSummons(@Request() req) {
    return this.summonsService.getSummons(req.user.userId);
  }

  @Post()
  async saveSummon(@Request() req, @Body() createSummonDto: CreateSummonDto) {
    return this.summonsService.saveSummon(req.user.userId, createSummonDto);
  }

  @Delete()
  async clearSummons(@Request() req) {
    return this.summonsService.clearSummons(req.user.userId);
  }

  @Get('count')
  async getSummonCount(@Request() req) {
    return { count: await this.summonsService.getSummonCount(req.user.userId) };
  }

  @Put('count')
  async setSummonCount(@Request() req, @Body('count') count: number) {
    return this.summonsService.setSummonCount(req.user.userId, count);
  }

  @Post('count/increment')
  async incrementSummonCount(@Request() req, @Body('by') by: number = 1) {
    return this.summonsService.incrementSummonCount(req.user.userId, by);
  }

  @Post('count/reset')
  async resetSummonCount(@Request() req) {
    return this.summonsService.resetSummonCount(req.user.userId);
  }

  @Get('stats/ssr')
  async getSSRStats(@Request() req) {
    return this.summonsService.getSSRStats(req.user.userId);
  }
}
