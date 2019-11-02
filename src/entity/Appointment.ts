import { IsNotEmpty, Length } from 'class-validator';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
  export class Appointment {
  @PrimaryGeneratedColumn()
    public id: number;

  @Column()
    @IsNotEmpty()
    public startAt: Date;

  @Column()
    @IsNotEmpty()
    public endAt: Date;

  @Column()
    @IsNotEmpty()
    public isValidated: Boolean;

  @Column()
    @IsNotEmpty()
    public doctor: number;

  @Column()
    @IsNotEmpty()
    public patient: number;
}
