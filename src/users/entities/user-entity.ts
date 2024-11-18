import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from 'src/common/enum/role.enum';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

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
