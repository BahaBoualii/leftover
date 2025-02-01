import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Role } from 'src/common/enum/role.enum';
import { Exclude } from 'class-transformer';
import { UserStatus } from 'src/common/enum/user-status.enum';
import { Customer } from 'src/customers/entities/customer.entity';
import { Store } from 'src/stores/entities/store.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phoneNumber: string;
  //why do we need the status column?
  @Column({default: UserStatus.ACTIVE})
  status: UserStatus;

  @OneToOne(() => Customer, (customer) => customer.user, { cascade: true })
  @JoinColumn()
  customer: Customer;

  @OneToOne(() => Store, (store) => store.user, { cascade: true })
  @JoinColumn()
  store: Store;

  @Column({ type: 'enum', enum: Role, default: [Role.USER] })
  role: Role;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  @Exclude()
  verificationToken?: string;

  @Column({ nullable: true })
  @Exclude()
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenExpiry?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
