import { Body, Controller, Post } from '@nestjs/common';
import { type CreateUrlPayload } from '@url-shortener/shared';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body() payload: CreateUrlPayload) {
    return this.urlsService.createShortUrl(payload);
  }
}
