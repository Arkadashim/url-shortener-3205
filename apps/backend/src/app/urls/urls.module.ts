import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Click } from '../entities/click.entity';
import { Url } from '../entities/url.entity';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click])],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
