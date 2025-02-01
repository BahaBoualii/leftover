import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './entities/store.entity';
import { MailModule } from 'src/mailing/mail.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';
import { User } from 'src/users/entities/user.entity';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Store, User, SurpriseBag]), MailModule],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoresModule {}
