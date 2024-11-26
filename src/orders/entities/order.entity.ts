import { OrderStatus } from 'src/common/enum/order-status.enum';
import { Customer } from 'src/customers/entities/customer.entity';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  orderId: number;

  @Column('timestamp')
  orderDate: Date;

  @Column()
  status: OrderStatus;

  @ManyToOne(() => SurpriseBag, { onDelete: 'CASCADE' })
  @JoinColumn()
  bag: SurpriseBag;

  @ManyToOne(() => Customer, (customer) => customer.orderHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Customer;

  @Column()
  pickupCode: string;
}
