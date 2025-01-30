import { BagStatus } from 'src/common/enum/bag-status.enum';
import { MealType } from 'src/common/enum/meal-type.enum';
import { Store } from 'src/stores/entities/store.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class SurpriseBag {
  @PrimaryGeneratedColumn('uuid')
  bagId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('float')
  originalValue: number;

  @Column('float')
  discountedPrice: number;

  @Column('int')
  quantity: number;

  @Column()
  mealType: MealType;

  @Column('simple-array')
  allergenInfo: string[];

  @Column('timestamp')
  pickupStart: Date;

  @Column('timestamp')
  pickupEnd: Date;

  @Column()
  status: BagStatus;

  @ManyToOne(() => Store, (store) => store.activeBags, { onDelete: 'CASCADE' })
  store: Store;
}
