import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ValidatePickupDto {
  @ApiProperty({
    description: 'The pickup code provided to the customer',
    example: 'ABC123',
    minLength: 6,
    maxLength: 6,
    required: true
  })
  @IsString()
  @Length(6, 6)
  pickupCode: string;
}