import { Injectable, ConflictException, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { BagStatus } from '../common/enum/bag-status.enum';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import { generatePickupCode } from 'src/common/utils/pickup-code.generator';
import { OrderStatus } from 'src/common/enum/order-status.enum';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(SurpriseBag)
    private readonly surpriseBagsRepository: Repository<SurpriseBag>,
    @InjectRepository(Customer)
    private readonly customersRepository: Repository<Customer>,
    private readonly dataSource: DataSource
  ) {}

  async createReservation(customerId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      // Lock the bag record for atomic operation
      const bag = await queryRunner.manager.findOne(SurpriseBag, {
        where: { bagId: createOrderDto.bagId },
        lock: { mode: 'pessimistic_write' } // Ensures other transactions can't modify it
      });
  
      if (!bag) {
        throw new NotFoundException('Surprise bag not found');
      }
  
      if (bag.status !== BagStatus.AVAILABLE || bag.quantity <= 0) {
        throw new ConflictException('Bag is not available for reservation');
      }
  
      const customer = await queryRunner.manager.findOne(Customer, {
        where: { customerId }
      });
  
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }
  
      // Generate unique pickup code
      const pickupCode = await generatePickupCode();
  
      // Create new order
      const order = queryRunner.manager.create(Order, {
        customer,
        bag,
        status: OrderStatus.PENDING,
        orderDate: new Date(),
        pickupCode
      });
  
      // Update bag quantity
      bag.quantity--;
      if (bag.quantity === 0) {
        bag.status = BagStatus.SOLD_OUT;
      }
  
      await queryRunner.manager.save(bag);
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
  
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  

  async validatePickup(orderId: string, pickupCode: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { orderId }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Order is not in confirmed status');
    }

    if (order.pickupCode !== pickupCode) {
      throw new BadRequestException('Invalid pickup code');
    }

    return order;
  }

  async cancelOrder(orderId: string, customerId: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await this.ordersRepository.findOne({
        where: { orderId, customer: { customerId } },
        relations: ['bag']
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      if (order.status === OrderStatus.CANCELLED) {
        throw new BadRequestException('Order is already cancelled');
      }

      // Check if cancellation is within allowed timeframe
      const now = new Date();
      const pickupStart = order.bag.pickupStart;
      const minutesUntilPickup = (pickupStart.getTime() - now.getTime()) / (1000 * 60);

      if (minutesUntilPickup < 30) {
        throw new BadRequestException('Orders can only be cancelled at least 30 minutes before pickup time');
      }

      // Update order status
      order.status = OrderStatus.CANCELLED;

      // Return bag to inventory
      const bag = order.bag;
      bag.quantity++;
      if (bag.status === BagStatus.SOLD_OUT) {
        bag.status = BagStatus.AVAILABLE;
      }

      await queryRunner.manager.save(bag);
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async confirmOrder(orderId: string, storeId: string): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
  
    try {
      const order = await this.ordersRepository.findOne({
        where: { orderId },
        relations: ['bag', 'bag.store']
      });
  
      if (!order) {
        throw new NotFoundException('Order not found');
      }
  
      if (order.bag.store.storeId !== storeId) {
        console.log(order.bag.store.storeId);
        console.log(storeId);
        throw new UnauthorizedException('Not authorized to confirm this order');
      }
  
      if (order.status !== OrderStatus.PENDING) {
        throw new BadRequestException('Order cannot be confirmed in current status');
      }
  
      order.status = OrderStatus.CONFIRMED;
      await queryRunner.manager.save(order);
      await queryRunner.commitTransaction();
  
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  
}
