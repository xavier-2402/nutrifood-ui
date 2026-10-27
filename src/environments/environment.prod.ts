declare global {
  interface Window {
    __env: any;
  }
}

export const environment = {
  production: true,
  apiUrl: window.__env?.API_BASE_URL
};