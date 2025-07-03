import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Click } from './click.entity';

@Entity('url')
@Index('idx_urls_short_url', ['shortUrl'], { unique: true })
@Index('idx_urls_created_at', ['createdAt'])
export class Url {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  shortUrl!: string;

  @Column({ type: 'text' })
  originalUrl!: string;

  @Column({ type: 'timestamp', default: 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'integer', default: 0 })
  clickCount?: number;

  @OneToMany(() => Click, (click) => click.url, { cascade: true })
  clicks?: Click[];
}
