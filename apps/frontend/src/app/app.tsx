import React, { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm';
import UrlList from '../components/UrlList';
import { getUrls } from '../api';
import { type ShortUrl } from '../types';
import '../styles/index.css';

const App: React.FC = () => {
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUrls = async () => {
    await getUrls()
      .then((urls) => setUrls(urls))
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
