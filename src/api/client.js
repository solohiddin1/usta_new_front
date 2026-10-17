import axios from 'axios';
import { getLang } from '../i18n/translations';

// If VITE_BACKEND_URL or VITE_API_URL is set (e.g. in .env), use it.
// If not set, requests use relative paths (same origin).
const rawBase = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL;
const BASE_URL = rawBase ? rawBase.trim() : '';

export const getApiUrl = (path) => {
  const lang = getLang();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (!BASE_URL || BASE_URL === '/') {
    return `/${lang}/api/v1${cleanPath}`;
  }
  return `${BASE_URL.replace(/\/$/, '')}/${lang}/api/v1${cleanPath}`;
};

export const getImageUrl = (url) => {
  if (!url) return '';
  // If the backend returns a URL with localhost or 127.0.0.1, convert to relative /media/
  // so the request travels via the ngrok/domain proxy to Django.
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    const mediaIdx = url.indexOf('/media/');
    if (mediaIdx !== -1) {
      return url.substring(mediaIdx);
    }
  }
  return url;
};

export const api = {
  get: (path, config) => axios.get(getApiUrl(path), config),
  post: (path, data, config) => axios.post(getApiUrl(path), data, config),
  patch: (path, data, config) => axios.patch(getApiUrl(path), data, config),
  delete: (path, config) => axios.delete(getApiUrl(path), config),
};
