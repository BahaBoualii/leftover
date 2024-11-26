import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from 'src/users/entities/user.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { SurpriseBag } from 'src/suprise-bags/entities/surprise-bag.entity';
import { PickupWindow } from 'src/pickup-window/entities/pickup-window.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Location } from 'src/location/entities/location.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: `${process.env.DB_PASSWORD}`,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    User,
    Customer,
    Store,
    Review,
    SurpriseBag,
    PickupWindow,
    Order,
    Location,
  ],
});
