import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { Location } from 'src/location/entities/location.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  customerId: string;

  @OneToOne(() => User, (user) => user.customer, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @OneToMany(() => Order, (order) => order.customer)
  orderHistory: Order[];

  @ManyToOne(() => Location, { cascade: true })
  @JoinColumn()
  location: Location;

  @ManyToMany(() => Store, { cascade: true })
  @JoinTable()
  favoriteStores: Store[];

  @OneToMany(() => Review, (review) => review.customer)
  reviews: Review[];
}
