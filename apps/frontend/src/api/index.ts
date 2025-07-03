import axios from "axios";
import { type ShortUrl, type CreateUrlPayload, type Analytics } from "../src/types";

const API_BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const createShortUrl = async (
  payload: CreateUrlPayload
): Promise<ShortUrl> => {
  const response = await api.post("/shorten", payload);
  return response.data;
};

export const getUrls = async (): Promise<ShortUrl[]> => {
  const response = await api.get("/urls");
  return response.data;
};

export const getAnalytics = async (shortUrl: string): Promise<Analytics> => {
  const response = await api.get(`/analytics/${shortUrl}`);
  return response.data;
};

export const deleteUrl = async (shortUrl: string): Promise<void> => {
  await api.delete(`/delete/${shortUrl}`);
};
