import { type ShortUrl } from '@url-shortener/shared';
import React, { useEffect, useState } from 'react';
import { getUrls } from '../api';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import '../styles/index.css';

const App: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUrls = async () => {
    await getUrls()
      .then((urls) => {
        Array.isArray(urls)
          ? setUrls(urls)
          : setError('Incorrect server response!');
      })
      .catch(() => setError('Failed to fetch'));
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="app-container">
      <div className="card">
        <h1>URL Shortener</h1>
        <UrlForm
          onSuccess={fetchUrls}
          setError={setError}
          setSuccess={setSuccess}
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <UrlList
          urls={urls}
          onDelete={fetchUrls}
          setError={setError}
          setSuccess={setSuccess}
        />
      </div>
    </div>
  );
};

export default App;
