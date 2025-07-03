import { type Analytics, type ShortUrl } from '@url-shortener/shared/';
import React, { useState } from 'react';
import { deleteUrl, getAnalytics } from '../api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface UrlItemProps {
  url: ShortUrl;
  onDelete: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

const UrlItem: React.FC<UrlItemProps> = ({
  url,
  onDelete,
  setError,
  setSuccess,
}) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  const handleAnalytics = async () => {
    await getAnalytics(url.shortUrl)
      .then((data) => setAnalytics(data))
      .catch(() => setError('Failed to fetch'));
  };

  const handleDelete = async () => {
    await deleteUrl(url.shortUrl)
      .then(() => {
        setSuccess('URL deleted successfully');
        onDelete();
      })
      .catch((err) =>
        setError(err?.response?.data?.message || 'Failed to delete URL')
      );
  };

  return (
    <li className="url-item">
      <p>
        <strong>Short URL:</strong>{' '}
        <a
          href={`${API_BASE_URL}/${url.shortUrl}`}
          target="_blank"
        >{`${url.shortUrl}`}</a>
      </p>
      <p>
        <strong>Original URL:</strong>{' '}
        <a href={url.originalUrl} target="_blank">
          {url.originalUrl}
        </a>
      </p>
      <p>
        <strong>Created:</strong> {new Date(url.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Clicks:</strong> {url.clickCount}
      </p>
      <div className="button-group">
        <button className="analytics" onClick={handleAnalytics}>
          View Analytics
        </button>
        <button className="delete" onClick={handleDelete}>
          Delete
        </button>
      </div>
      {analytics && (
        <div className="analytics-data">
          <p>
            <strong>Analytics:</strong>
          </p>
          <p>Clicks: {analytics.clickCount}</p>
          <p>Last 5 IPs: {analytics.lastIps.join(', ') || 'None'}</p>
        </div>
      )}
    </li>
  );
};

export default UrlItem;
