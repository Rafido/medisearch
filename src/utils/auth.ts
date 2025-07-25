// Simple encryption/decryption for localStorage (basic security)
const SECRET_KEY = 'smart-medicine-finder-2025';

// Simple XOR encryption (for basic obfuscation)
const encrypt = (text: string): string => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return btoa(result); // Base64 encode
};

const decrypt = (encryptedText: string): string => {
  try {
    const decoded = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(decoded.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
    }
    return result;
  } catch {
    return '';
  }
};

// Auth storage utilities
export const AUTH_STORAGE = {
  setAuthData: (isAuthenticated: boolean, user?: any) => {
    const authData = {
      isAuthenticated,
      user,
      timestamp: Date.now(),
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours
    };
    
    const encrypted = encrypt(JSON.stringify(authData));
    localStorage.setItem('smf_auth', encrypted);
  },

  getAuthData: () => {
    try {
      const encrypted = localStorage.getItem('smf_auth');
      if (!encrypted) return null;

      const decrypted = decrypt(encrypted);
      if (!decrypted) return null;

      const authData = JSON.parse(decrypted);
      
      // Check if token has expired
      const now = Date.now();
      if (now - authData.timestamp > authData.expiresIn) {
        AUTH_STORAGE.clearAuth();
        return null;
      }

      return authData;
    } catch {
      AUTH_STORAGE.clearAuth();
      return null;
    }
  },

  clearAuth: () => {
    localStorage.removeItem('smf_auth');
  },

  isAuthenticated: (): boolean => {
    const authData = AUTH_STORAGE.getAuthData();
    return authData?.isAuthenticated || false;
  },

  getUser: () => {
    const authData = AUTH_STORAGE.getAuthData();
    return authData?.user || null;
  }
};

// Valid credentials
export const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'Admin@123'
};

// Validate login credentials
export const validateCredentials = (username: string, password: string): boolean => {
  return username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password;
};
