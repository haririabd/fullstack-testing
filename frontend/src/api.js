import axios from 'axios';

const getBaseURL = () => {
  // If we are on localhost, use the standard localhost URL
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/';
  }

  // If we are in a GitHub Codespace, the URL looks like:
  // https://silver-space-waffle-v667pxpj7993pxv-5173.app.github.dev
  // We need to replace "-5173" with "-8000"
  if (window.location.hostname.includes('github.dev')) {
    const currentURL = window.location.origin; // Full URL
    const apiURL = currentURL.replace('-5173', '-8000');
    return `${apiURL}/api/`;
  }

  // Fallback for production or other environments
  return '/api/'; 
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
});

// Example function to get data from an endpoint
export default API;