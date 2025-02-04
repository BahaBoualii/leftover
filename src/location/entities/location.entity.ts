import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  locationId: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column({type: 'float'})
  latitude: number;

  @Column({type: 'float'})
  longitude: number;


  @Column()
  postalCode: string;

  @Column()
  country: string;
}
