import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurpriseBag } from './entities/surprise-bag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurpriseBag])],
})
export class SupriseBagsModule {}
