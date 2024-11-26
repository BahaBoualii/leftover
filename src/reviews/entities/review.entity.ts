import { Customer } from 'src/customers/entities/customer.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  reviewId: number;

  @Column('float')
  rating: number;

  @Column()
  comment: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  datePosted: Date;

  @ManyToOne(() => Store, (store) => store.reviews, { onDelete: 'CASCADE' })
  store: Store;

  @ManyToOne(() => Customer, (customer) => customer.reviews, {
    onDelete: 'CASCADE',
  })
  customer: Customer;
}
