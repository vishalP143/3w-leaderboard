// client/src/utils/constants.js

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return ''; // 🌐 In production, use relative path
  }
  return 'http://localhost:5000'; // 💻 In development (local or Gitpod)
};

export const BASE_URL = getBaseUrl();
