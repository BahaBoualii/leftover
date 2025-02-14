/* eslint-disable no-unused-vars */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SurpriseBag } from './entities/surprise-bag.entity';
import { CreateSurpriseBagDto } from './dto/create-surprise-bag.dto';
import { UpdateSurpriseBagDto } from './dto/update-surprise-bag.dto';
import { Store } from 'src/stores/entities/store.entity';
import { BagStatus } from 'src/common/enum/bag-status.enum';

@Injectable()
export class SurpriseBagService {
  constructor(
    @InjectRepository(SurpriseBag)
    private readonly surpriseBagRepository: Repository<SurpriseBag>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(
    createSurpriseBagDto: CreateSurpriseBagDto,
    storeId: string,
    userId: string,
  ): Promise<SurpriseBag> {
    const store = await this.storeRepository.findOne({
      where: { storeId },
      relations: ['owner'],
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (store.owner.id !== userId) {
      console.log(store.owner.id);
      console.log(userId);
      throw new ForbiddenException('You are not the owner of this store');
    }

    const surpriseBag = this.surpriseBagRepository.create({
      ...createSurpriseBagDto,
      store,
    });

    return this.surpriseBagRepository.save(surpriseBag);
  }

  async findAll(): Promise<SurpriseBag[]> {
    return this.surpriseBagRepository.find({ relations: ['store'] });
  }

  async findOne(id: string): Promise<SurpriseBag> {
    const surpriseBag = await this.surpriseBagRepository.findOne({
      where: { bagId: id },
      relations: ['store'],
    });
    if (!surpriseBag) {
      throw new NotFoundException('Surprise bag not found');
    }
    return surpriseBag;
  }

  async update(
    id: string,
    updateSurpriseBagDto: UpdateSurpriseBagDto,
  ): Promise<SurpriseBag> {
    const surpriseBag = await this.surpriseBagRepository.preload({
      bagId: id,
      ...updateSurpriseBagDto,
    });
    if (!surpriseBag) {
      throw new NotFoundException('Surprise bag not found');
    }
    return this.surpriseBagRepository.save(surpriseBag);
  }

  async remove(id: string): Promise<void> {
    const result = await this.surpriseBagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Surprise bag not found');
    }
  }

  async updateInventory(id: string, quantity: number): Promise<SurpriseBag> {
    const surpriseBag = await this.surpriseBagRepository.findOne({
      where: { bagId: id },
    });
    if (!surpriseBag) {
      throw new NotFoundException('Surprise bag not found');
    }
    surpriseBag.quantity = quantity;
    if (quantity === 0) {
      surpriseBag.status = BagStatus.CANCELLED;
    }
    return this.surpriseBagRepository.save(surpriseBag);
  }
}
