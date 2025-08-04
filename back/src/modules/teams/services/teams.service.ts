import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team, TeamData, TeamCharacter } from '../entities/team.entity';
import { CreateTeamDto, UpdateTeamDto, TeamDataDto } from '../dto/team.dto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamRepository: Repository<Team>,
    @InjectRepository(TeamData)
    private teamDataRepository: Repository<TeamData>,
  ) {}

  // Individual team management
  async createTeam(userId: string, createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create({
      ...createTeamDto,
      userId,
    });
    return this.teamRepository.save(team);
  }

  async getTeams(userId: string): Promise<Team[]> {
    return this.teamRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getTeam(userId: string, teamId: string): Promise<Team> {
    const team = await this.teamRepository.findOne({
      where: { id: teamId, userId },
    });

    if (!team) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }

    return team;
  }

  async updateTeam(userId: string, teamId: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    const team = await this.getTeam(userId, teamId);

    // Update team properties
    Object.assign(team, updateTeamDto);

    return this.teamRepository.save(team);
  }

  async deleteTeam(userId: string, teamId: string): Promise<void> {
    const result = await this.teamRepository.delete({ id: teamId, userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Team with ID ${teamId} not found`);
    }
  }

  // Team data management (equivalent to getTeamsFromCookies and saveTeamsToCookies)
  async getTeamData(userId: string): Promise<Record<string, TeamCharacter[]>> {
    const teamData = await this.teamDataRepository.findOne({
      where: { userId },
    });

    if (!teamData) {
      // If no team data exists, create an empty one
      const newTeamData = this.teamDataRepository.create({
        userId,
        data: {},
      });
      await this.teamDataRepository.save(newTeamData);
      return {};
    }

    return teamData.data;
  }

  async saveTeamData(userId: string, teamDataDto: TeamDataDto): Promise<TeamData> {
    let teamData = await this.teamDataRepository.findOne({
      where: { userId },
    });

    if (!teamData) {
      // If no team data exists, create a new one
      teamData = this.teamDataRepository.create({
        userId,
        data: teamDataDto.data,
      });
    } else {
      // Update existing team data
      teamData.data = teamDataDto.data;
    }

    return this.teamDataRepository.save(teamData);
  }
}
