import { PartialType } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLocationDto {
    @IsString()
    address: string;

    @IsString()
    city: string;

    @IsString()
    postalCode: string;

    @IsString()
    country: string;
}

export class UpdateLocationDto extends PartialType(CreateLocationDto){}