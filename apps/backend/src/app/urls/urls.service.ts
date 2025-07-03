import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUrlPayload, ShortUrl } from '@url-shortener/shared';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {
  async createShortUrl(payload: CreateUrlPayload): Promise<ShortUrl> {
    const { originalUrl, alias } = payload;

    if (!this.isValidUrl(originalUrl)) {
      throw new BadRequestException('Invalid URL');
    }

    const shortUrl = alias || nanoid(8);

    return {
      shortUrl,
      originalUrl,
      createdAt: new Date().toISOString(),
      clickCount: 0,
    };
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
