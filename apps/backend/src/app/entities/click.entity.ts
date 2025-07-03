import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Url } from './url.entity';

@Entity('clicks')
export class Click {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ipAddress!: string;

  @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  clickedAt?: Date;

  @ManyToOne(() => Url, (url) => url.clicks)
  url?: Url;
}
