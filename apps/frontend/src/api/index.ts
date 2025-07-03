import {
  type Analytics,
  type CreateUrlPayload,
  type ShortUrl,
} from '@url-shortener/shared/';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createShortUrl = async (
  payload: CreateUrlPayload
): Promise<ShortUrl> => {
  const response = await api.post('/shorten', payload);
  return response.data;
};

export const getUrls = async (): Promise<ShortUrl[]> => {
  const response = await api.get('/urls');
  return response.data;
};

export const getAnalytics = async (shortUrl: string): Promise<Analytics> => {
  const response = await api.get(`/analytics/${shortUrl}`);
  return response.data;
};

export const deleteUrl = async (shortUrl: string): Promise<void> => {
  await api.delete(`/delete/${shortUrl}`);
};
