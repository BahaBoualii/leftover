/* eslint-disable no-unused-vars */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store, StoreCategory } from './entities/store.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { User } from '../users/entities/user.entity';
import { MailService } from '../mailing/mail.service';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import { paginate, PaginationMeta } from 'src/utils/pagination';

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
      user,
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
    if (store.user.id !== userId) {
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
      relations: ['user'],
    });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.isVerified = true;
    await this.storeRepository.save(store);

    // Send verification email
    await this.mailService.sendStoreVerificationEmail(
      store.user.email,
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

  async searchNearbyStores(
    latitude: number,
    longitude: number,
    radius: number,
    category?: StoreCategory,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Store[]; pagination: PaginationMeta }> {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.location', 'location')
      .where(
        `ST_DWithin(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(location.longitude, location.latitude), 4326)::geography,
          :radius * 1000
        )`,
        { latitude, longitude, radius },
      );

    if (category) {
      query.andWhere('store.category = :category', { category });
    }

    if (sortBy === 'distance') {
      query
        .addSelect(
          `ST_Distance(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(location.longitude, location.latitude), 4326)::geography
        )`,
          'distance',
        )
        .orderBy('distance', sortOrder);
    } else if (sortBy) {
      query.orderBy(`store.${sortBy}`, sortOrder);
    }

    return paginate(query, page, limit);
  }

  async getFeaturedStores(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Store[]; pagination: PaginationMeta }> {
    const query = this.storeRepository
      .createQueryBuilder('store')
      .where('store.averageRating >= :rating', { rating: 3.5 });
    return paginate(query, page, limit);
  }
}
