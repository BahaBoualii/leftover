import { PartialType } from '@nestjs/mapped-types';
import { CreateSurpriseBagDto } from './create-surprise-bag.dto';

export class UpdateSurpriseBagDto extends PartialType(CreateSurpriseBagDto) {}
