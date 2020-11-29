export const SERVER = {
  address: 'localhost',
  port: 3000,
};

export const DATABASE = {
  url: 'mongodb://localhost:27017/Bus_Mama',
};

export const ENCRYPTION = {
  algorithm: 'sha256',
  encodingBase: 'base64',
  cipherAlgorithm: 'aes-256-ctr',
  key: 'f8674ff5ab6d971df2abc627b90e60628be929ec',
};

export const HANDLERS_PATH = {
  root: '/',
  bus: '/bus',
  profile: '/profile',
};
