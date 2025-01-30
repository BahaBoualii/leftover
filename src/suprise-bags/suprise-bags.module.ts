import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurpriseBag } from './entities/surprise-bag.entity';
import { SurpriseBagController } from './surprise-bag.controller';
import { SurpriseBagService } from './surprise-bags.service';
import { Store } from 'src/stores/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SurpriseBag, Store])],
  controllers: [SurpriseBagController],
  providers: [SurpriseBagService],
  exports: [SurpriseBagService],
})
export class SupriseBagsModule {}
