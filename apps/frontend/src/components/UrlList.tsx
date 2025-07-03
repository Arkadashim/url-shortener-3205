import React from 'react';
import { type ShortUrl } from '../types';
import UrlItem from './UrlItem';

interface UrlListProps {
  urls: ShortUrl[];
  onDelete: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

const UrlList: React.FC<UrlListProps> = ({
  urls,
  onDelete,
  setError,
  setSuccess,
}) => {
  return (
    <div className="url-list">
      <h2>Your Short URLs</h2>
      {urls.length === 0 ? (
        <p className="no-urls">No URLs created yet.</p>
      ) : (
        <ul>
          {urls.map((url) => (
            <UrlItem
              key={url.shortUrl}
              url={url}
              onDelete={onDelete}
              setError={setError}
              setSuccess={setSuccess}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UrlList;
