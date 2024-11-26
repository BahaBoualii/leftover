import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './authentification/auth.module';
import { UsersModule } from './users/user.module';
import { MailModule } from './mailing/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AppDataSource } from './utils/data-source';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';
import { SupriseBagsModule } from './suprise-bags/suprise-bags.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LocationModule } from './location/location.module';
import { PickupWindowModule } from './pickup-window/pickup-window.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),
    AuthModule,
    UsersModule,
    MailModule,
    CustomersModule,
    StoresModule,
    SupriseBagsModule,
    OrdersModule,
    ReviewsModule,
    LocationModule,
    PickupWindowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
