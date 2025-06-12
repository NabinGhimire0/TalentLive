import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

let echo = null;
let store = null;

export const injectStore = (_store) => {
  store = _store;
};

/**
 * Initialize Echo instance using the latest token from Redux store
 */
export const initializeEcho = () => {
  if (!store) {
    throw new Error("Redux store not injected. Call injectStore(store) first.");
  }

  const token = store.getState().auth.token;
  console.log(token);

  if (!token) {
    throw new Error("No auth token available in Redux store");
  }

  echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: 'http://localhost:8000/broadcasting/auth',
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return echo;
};

/**
 * Get the current Echo instance
 */
export const getEcho = () => {
  if (!echo) {
    throw new Error("Echo is not initialized. Call initializeEcho() first.");
  }
  return echo;
};
