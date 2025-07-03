import React, { useState } from 'react';
import { createShortUrl } from '../api';
import { type CreateUrlPayload } from '../types';

interface UrlFormProps {
  onSuccess: () => void;
  setError: (error: string) => void;
  setSuccess: (success: string) => void;
}

const UrlForm: React.FC<UrlFormProps> = ({
  onSuccess,
  setError,
  setSuccess,
}) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload: CreateUrlPayload = {
        originalUrl,
        alias: alias || undefined,
        expiresAt: expiresAt || undefined,
      };
      await createShortUrl(payload);
      setSuccess('URL shortened successfully!');
      setOriginalUrl('');
      setAlias('');
      setExpiresAt('');
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to shorten URL');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Original URL</label>
        <input
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          placeholder="https://example.com"
          required
        />
      </div>
      <div>
        <label>Custom Alias (optional)</label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="my-custom-alias"
          maxLength={20}
        />
      </div>
      <div>
        <label>Expiration Date (optional)</label>
        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>
      <button type="submit">Shorten URL</button>
    </form>
  );
};

export default UrlForm;
