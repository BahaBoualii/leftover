import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PickupWindow } from './entities/pickup-window.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PickupWindow])],
})
export class PickupWindowModule {}
