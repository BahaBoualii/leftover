/* eslint-disable no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mailing/mail.service';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(SurpriseBag)
    private readonly surpriseBagRepository: Repository<SurpriseBag>,
    private readonly mailService: MailService,
  ) {}

  async createStore(
    createStoreDto: CreateStoreDto,
    userId: string,
  ): Promise<Store> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const store = this.storeRepository.create({
      ...createStoreDto,
      owner: user,
    });
    return this.storeRepository.save(store);
  }

  async getSurpriseBagsByStore(storeId: string) {
    const store = await this.storeRepository.findOne({ where: { storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return this.surpriseBagRepository.find({
      where: { store: { storeId } },
      relations: ['store'],
    });
  }

  async updateStore(
    storeId: string,
    updateStoreDto: UpdateStoreDto,
    userId: string,
  ): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { storeId },
      relations: ['user'],
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    if (store.owner.id !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to update this store',
      );
    }

    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  // Verify a store
  async verifyStore(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { storeId },
      relations: ['owner'],
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.isVerified = true;
    await this.storeRepository.save(store);

    // Send verification email
    await this.mailService.sendStoreVerificationEmail(
      store.owner.email,
      store.storeName,
    );

    return store;
  }

  // Get store by ID
  async getStoreById(storeId: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { storeId } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  // Get all stores (optionally filtered by verification status)
  async getAllStores(): Promise<Store[]> {
    const stores = await this.storeRepository.find();
    return stores;
  }

  async findByUserId(userId: string): Promise<Store | null> {
    return this.storeRepository.findOne({ where: { owner: { id: userId } } });
  }
}
