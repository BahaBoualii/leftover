import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/common/enum/order-status.enum';


export class OrderResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the order',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  orderId: string;

  @ApiProperty({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.CONFIRMED,
    enumName: 'OrderStatus'
  })
  status: OrderStatus;

  @ApiProperty({
    description: 'Unique pickup code for the order',
    example: 'ABC123'
  })
  pickupCode: string;

  @ApiProperty({
    description: 'Timestamp when the order was created',
    example: '2024-02-02T12:00:00Z'
  })
  orderDate: Date;

  @ApiProperty({
    description: 'Details of the surprise bag',
    example: {
      bagId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Evening Surprise',
      description: 'Delicious dinner surprise bag',
      originalValue: 30.00,
      discountedPrice: 15.00
    }
  })
  bag: {
    bagId: string;
    name: string;
    description: string;
    originalValue: number;
    discountedPrice: number;
  };

  @ApiProperty({
    description: 'Pickup window details',
    example: {
      start: '2024-02-02T18:00:00Z',
      end: '2024-02-02T19:00:00Z'
    }
  })
  pickupWindow: {
    start: Date;
    end: Date;
  };
}