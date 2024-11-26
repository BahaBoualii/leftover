import { Store } from 'src/stores/entities/store.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class PickupWindow {
  @PrimaryGeneratedColumn('uuid')
  pickupWindowId: number;

  @Column('timestamp')
  startTime: Date;

  @Column('timestamp')
  endTime: Date;

  @Column('int', { default: 0 })
  availableSlots: number;

  @ManyToOne(() => Store, (store) => store.pickupWindows, {
    onDelete: 'CASCADE',
  })
  store: Store;
}
