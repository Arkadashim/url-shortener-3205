import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { type CreateUrlPayload } from '@url-shortener/shared';
import { UrlsService } from './urls.service';

@Controller()
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  async shorten(@Body() payload: CreateUrlPayload) {
    return this.urlsService.createShortUrl(payload);
  }

  @Get('urls')
  async get() {
    return await this.urlsService.get();
  }

  @Get(':shortUrl')
  async redirect(
    @Param('shortUrl') shortUrl: string,
    @Ip() ipAddress: string,
    @Res() res: any
  ): Promise<void> {
    const url = await this.urlsService.getOriginalUrl(shortUrl, ipAddress);
    res.redirect(url.originalUrl);
  }

  @Get('info/:shortUrl')
  async getInfo(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.getUrlInfo(shortUrl);
  }

  @Delete('delete/:shortUrl')
  async delete(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.deleteUrl(shortUrl);
  }

  @Get('analytics/:shortUrl')
  async getAnalytics(@Param('shortUrl') shortUrl: string) {
    return this.urlsService.getAnalytics(shortUrl);
  }
}
