export type AuthCredentials = {
  email: string;
  senha: string;
};

export type AuthSession = {
  tokenType: string;
  accessToken: string;
  expiresAt: string;
  email: string;
  papel: string;
  firebaseUid: string | null;
};

export type UserProfile = {
  email: string;
  papel: string;
  firebaseUid: string | null;
};

export type StoredSession = {
  accessToken: string;
  expiresAt: string;
};
