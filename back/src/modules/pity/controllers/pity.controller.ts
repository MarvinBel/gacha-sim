import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { PityService } from '../services/pity.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SavePityHistoryDto } from '../dto/pity.dto';

@Controller('pity')
@UseGuards(JwtAuthGuard)
export class PityController {
  constructor(private readonly pityService: PityService) {}

  @Get(':banner')
  async getPity(@Request() req, @Param('banner') banner: string) {
    return this.pityService.getPity(req.user.userId, banner);
  }

  @Post(':banner/increment')
  async incrementPity(@Request() req, @Param('banner') banner: string) {
    return this.pityService.incrementPity(req.user.userId, banner);
  }

  @Post(':banner/reset')
  async resetPity(@Request() req, @Param('banner') banner: string) {
    return this.pityService.resetPity(req.user.userId, banner);
  }

  @Put(':banner')
  async setPity(
    @Request() req,
    @Param('banner') banner: string,
    @Body('count') count: number,
  ) {
    return this.pityService.setPity(req.user.userId, banner, count);
  }

  @Post('history')
  async savePityHistory(
    @Request() req,
    @Body() savePityHistoryDto: SavePityHistoryDto,
  ) {
    return this.pityService.savePityHistory(req.user.userId, savePityHistoryDto);
  }

  @Get('history')
  async getPityHistory(@Request() req) {
    return this.pityService.getPityHistory(req.user.userId);
  }

  @Delete('clear')
  async clearAllPities(@Request() req) {
    return this.pityService.clearAllPities(req.user.userId);
  }
}
