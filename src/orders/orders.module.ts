import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { StoresModule } from 'src/stores/store.module';

@Module({

  imports: [TypeOrmModule.forFeature([Order , SurpriseBag , Customer]), StoresModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],

})
export class OrdersModule {}
