import axios, { AxiosInstance } from 'axios';

/**
 * Generates the backend API URL dynamically based on the environment.
 * @returns {string} The base URL for API calls.
 */
const getBaseURL = (): string => {
  // Check for local development environment
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8000/api/';
  }

  // Handle GitHub Codespaces dynamic port forwarding
  if (window.location.hostname.includes('github.dev')) {
    const currentURL: string = window.location.origin;
    // Industry trick: swap the frontend port (5173) for the backend port (8000)
    const apiURL: string = currentURL.replace('-5173', '-8000');
    return `${apiURL}/api/`;
  }

  // Fallback for production (assuming same-domain hosting)
  return '/api/'; 
};

// Define the API instance with a specific Axios type
const API: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;