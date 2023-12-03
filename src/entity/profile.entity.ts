import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileImg: string;
}
