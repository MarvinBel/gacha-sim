import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request } from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateTeamDto, UpdateTeamDto, TeamDataDto } from '../dto/team.dto';

@Controller('teams')
@UseGuards(JwtAuthGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  // Individual team management
  @Post()
  async createTeam(@Request() req, @Body() createTeamDto: CreateTeamDto) {
    return this.teamsService.createTeam(req.user.userId, createTeamDto);
  }

  @Get()
  async getTeams(@Request() req) {
    return this.teamsService.getTeams(req.user.userId);
  }

  @Get(':id')
  async getTeam(@Request() req, @Param('id') id: string) {
    return this.teamsService.getTeam(req.user.userId, id);
  }

  @Put(':id')
  async updateTeam(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.updateTeam(req.user.userId, id, updateTeamDto);
  }

  @Delete(':id')
  async deleteTeam(@Request() req, @Param('id') id: string) {
    return this.teamsService.deleteTeam(req.user.userId, id);
  }

  // Team data management (equivalent to getTeamsFromCookies and saveTeamsToCookies)
  @Get('data/all')
  async getTeamData(@Request() req) {
    return { data: await this.teamsService.getTeamData(req.user.userId) };
  }

  @Put('data/all')
  async saveTeamData(@Request() req, @Body() teamDataDto: TeamDataDto) {
    return this.teamsService.saveTeamData(req.user.userId, teamDataDto);
  }
}
