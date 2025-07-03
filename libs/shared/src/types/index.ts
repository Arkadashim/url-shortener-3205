export interface ShortUrl {
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
}

export interface Analytics {
  clickCount: number;
  lastIps: string[];
}

export interface CreateUrlPayload {
  originalUrl: string;
  alias?: string;
  expiresAt?: string;
}
