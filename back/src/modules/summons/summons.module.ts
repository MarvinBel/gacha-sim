import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SummonsService } from './services/summons.service';
import { SummonsController } from './controllers/summons.controller';
import { Summon, SummonCount } from './entities/summon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Summon, SummonCount])],
  controllers: [SummonsController],
  providers: [SummonsService],
  exports: [SummonsService],
})
export class SummonsModule {}
