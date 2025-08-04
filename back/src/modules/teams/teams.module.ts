import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsService } from './services/teams.service';
import { TeamsController } from './controllers/teams.controller';
import { Team, TeamData, TeamCharacter } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, TeamData, TeamCharacter])],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
