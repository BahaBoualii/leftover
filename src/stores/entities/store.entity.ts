/* eslint-disable no-unused-vars */
import { Location } from 'src/location/entities/location.entity';
import { PickupWindow } from 'src/pickup-window/entities/pickup-window.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  storeId: string;
  storeId: string;

  @OneToOne(() => User, (user) => user.store, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  storeName: string;

  @Column()
  description: string;

  @Column()
  category: StoreCategory;

  @OneToMany(() => PickupWindow, (pickupWindow) => pickupWindow.store)
  pickupWindows: PickupWindow[];

  @Column({ default: false })
  isVerified: boolean;

  @Column('float', { default: 0 })
  averageRating: number;

  @OneToMany(() => SurpriseBag, (surpriseBag) => surpriseBag.store)
  activeBags: SurpriseBag[];

  @OneToMany(() => Review, (review) => review.store)
  reviews: Review[];

  @ManyToOne(() => Location, { cascade: true })
  @JoinColumn()
  location: Location;

  @Column({ nullable: true })
  photoUrl: string;

  @Column('float', { default: 0 })
  averageBagValue: number;
}

export enum StoreCategory {
  RESTAURANT = 'RESTAURANT',
  BAKERY = 'BAKERY',
  SUPERMARKET = 'SUPERMARKET',
  CAFE = 'CAFE',
  HOTEL = 'HOTEL',
  OTHER = 'OTHER',
}
