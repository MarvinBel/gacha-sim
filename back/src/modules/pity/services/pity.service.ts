import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pity, PityHistory } from '../entities/pity.entity';
import { CreatePityDto, UpdatePityDto, SavePityHistoryDto } from '../dto/pity.dto';

@Injectable()
export class PityService {
  constructor(
    @InjectRepository(Pity)
    private pityRepository: Repository<Pity>,
    @InjectRepository(PityHistory)
    private pityHistoryRepository: Repository<PityHistory>,
  ) {}

  async getPity(userId: string, banner: string): Promise<Pity> {
    const pity = await this.pityRepository.findOne({
      where: { userId, banner },
    });

    if (!pity) {
      // If no pity record exists, create a new one with count 0
      const newPity = this.pityRepository.create({
        userId,
        banner,
        count: 0,
      });
      return this.pityRepository.save(newPity);
    }

    return pity;
  }

  async incrementPity(userId: string, banner: string): Promise<Pity> {
    const pity = await this.getPity(userId, banner);
    pity.count += 1;
    return this.pityRepository.save(pity);
  }

  async resetPity(userId: string, banner: string): Promise<Pity> {
    const pity = await this.getPity(userId, banner);
    pity.count = 0;
    return this.pityRepository.save(pity);
  }

  async setPity(userId: string, banner: string, count: number): Promise<Pity> {
    const pity = await this.getPity(userId, banner);
    pity.count = count;
    return this.pityRepository.save(pity);
  }

  async savePityHistory(userId: string, dto: SavePityHistoryDto): Promise<PityHistory> {
    const pityHistory = this.pityHistoryRepository.create({
      userId,
      banner: dto.banner,
      pulls: dto.pulls,
      date: new Date(),
    });
    return this.pityHistoryRepository.save(pityHistory);
  }

  async getPityHistory(userId: string): Promise<PityHistory[]> {
    return this.pityHistoryRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });
  }

  async clearAllPities(userId: string): Promise<void> {
    await this.pityRepository.delete({ userId });
  }
}
