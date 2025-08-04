import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PityService } from './services/pity.service';
import { PityController } from './controllers/pity.controller';
import { Pity, PityHistory } from './entities/pity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pity, PityHistory])],
  controllers: [PityController],
  providers: [PityService],
  exports: [PityService],
})
export class PityModule {}
