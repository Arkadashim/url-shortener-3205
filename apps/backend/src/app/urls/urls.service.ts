import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUrlPayload } from '@url-shortener/shared';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Click } from '../entities/click.entity';
import { Url as UrlEntity } from '../entities/url.entity';

@Injectable()
export class UrlsService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly urlRepository: Repository<UrlEntity>,
    @InjectRepository(Click) private readonly clickRepository: Repository<Click>
  ) {}

  async createShortUrl(payload: CreateUrlPayload) {
    const { originalUrl, alias, expiresAt } = payload;

    if (!this.isValidUrl(originalUrl)) {
      throw new BadRequestException('Invalid URL');
    }

    if (alias && (alias.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(alias))) {
      throw new BadRequestException(
        'Alias must be up to 20 characters and contain only letters, numbers, -, or _'
      );
    }

    if (expiresAt && isNaN(new Date(expiresAt).getTime())) {
      throw new BadRequestException('Invalid expiresAt date');
    }

    const shortUrl = alias || nanoid(8);

    const existingUrl = await this.urlRepository.findOne({
      where: { shortUrl },
    });
    if (existingUrl) {
      throw new BadRequestException('Alias or short URL already exists');
    }

    const url = this.urlRepository.create({
      shortUrl,
      originalUrl,
      createdAt: new Date().toISOString(),
      clickCount: 0,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
    });

    await this.urlRepository.save(url);
    return url;
  }

  async get() {
    return await this.urlRepository.find();
  }

  async getOriginalUrl(shortUrl: string, ipAddress: string) {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      throw new NotFoundException('Short URL has expired');
    }

    await this.clickRepository.save({ ipAddress, url_shortUrl: url.shortUrl }); // Триггер обновит clickCount

    return url;
  }

  async getUrlInfo(shortUrl: string) {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    return url;
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }
    await this.urlRepository.remove(url); // Каскадное удаление удалит связанные clicks
  }

  async getAnalytics(shortUrl: string) {
    const url = await this.urlRepository.findOne({ where: { shortUrl } });
    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    const clicks = await this.clickRepository.find({
      where: { url_shortUrl: shortUrl },
      order: { clickedAt: 'DESC' },
      take: 5,
      select: ['ipAddress'],
    });

    return {
      clickCount: url.clickCount ?? 0,
      lastIps: clicks.map((click) => click.ipAddress),
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
