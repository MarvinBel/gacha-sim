import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summon, SummonCount } from '../entities/summon.entity';
import { CreateSummonDto, SummonStatsDto } from '../dto/summon.dto';

@Injectable()
export class SummonsService {
  constructor(
    @InjectRepository(Summon)
    private summonRepository: Repository<Summon>,
    @InjectRepository(SummonCount)
    private summonCountRepository: Repository<SummonCount>,
  ) {}

  async getSummons(userId: string): Promise<Summon[]> {
    return this.summonRepository.find({
      where: { userId },
      order: { timestamp: 'DESC' },
    });
  }

  async saveSummon(userId: string, createSummonDto: CreateSummonDto): Promise<Summon> {
    const { character, ...summonData } = createSummonDto;

    const summon = this.summonRepository.create({
      ...summonData,
      characterFilename: character.filename,
      characterTitle: character.title,
      characterFolder: character.folder,
      userId,
      timestamp: createSummonDto.timestamp || new Date(),
    });

    await this.incrementSummonCount(userId);

    return this.summonRepository.save(summon);
  }

  async clearSummons(userId: string): Promise<void> {
    await this.summonRepository.delete({ userId });
    await this.resetSummonCount(userId);
  }

  async getSummonCount(userId: string): Promise<number> {
    const summonCount = await this.summonCountRepository.findOne({
      where: { userId },
    });

    if (!summonCount) {
      const newSummonCount = this.summonCountRepository.create({
        userId,
        count: 0,
      });
      await this.summonCountRepository.save(newSummonCount);
      return 0;
    }

    return summonCount.count;
  }

  async setSummonCount(userId: string, count: number): Promise<SummonCount> {
    let summonCount = await this.summonCountRepository.findOne({
      where: { userId },
    });

    if (!summonCount) {
      summonCount = this.summonCountRepository.create({
        userId,
        count,
      });
    } else {
      summonCount.count = count;
    }

    return this.summonCountRepository.save(summonCount);
  }

  async incrementSummonCount(userId: string, by: number = 1): Promise<SummonCount> {
    const currentCount = await this.getSummonCount(userId);
    return this.setSummonCount(userId, currentCount + by);
  }

  async resetSummonCount(userId: string): Promise<SummonCount> {
    return this.setSummonCount(userId, 0);
  }

  async getSSRStats(userId: string): Promise<SummonStatsDto> {
    const summons = await this.getSummons(userId);

    if (!summons.length) {
      return { average: 0, totalSSR: 0, totalPulls: 0 };
    }

    const ssrCount = summons.filter(s => s.characterFolder === 'ssr').length;
    const total = summons.length;
    const average = +(ssrCount / total).toFixed(4); // Ex: 0.0125 = 1.25 %

    return {
      average,
      totalSSR: ssrCount,
      totalPulls: total,
    };
  }
}
