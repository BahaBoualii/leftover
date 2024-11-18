import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user-entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    try {
      console.log("hello")
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
       console.log(error)
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve users');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve user');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException('Failed to retrieve user');
      
    }
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { verificationToken: token },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify token');
    }
  }

  async findByResetToken(token: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { resetToken: token },
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify reset token');
    }
  }

  async markEmailAsVerified(userId: string): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        isVerified: true,
        verificationToken: null,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify email');
    }
  }

  async setResetToken(userId: string, resetToken: string): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        resetToken,
        resetTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to set reset token');
    }
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to update password');
    }
  }

  async clearResetToken(userId: string): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        resetToken: null,
        resetTokenExpiry: null,
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to clear reset token');
    }
  }
}