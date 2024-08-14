let redisValues = [{ 1234: 1234 }];

export const MockAuthRepository = {
  getSalt: jest.fn().mockImplementation(() => {
    return '1234';
  }),
  getHash: jest.fn().mockImplementation((password, salt) => {
    return 'ahaha';
  }),
  signAsync: jest.fn().mockImplementation((dto) => {
    return {
      ...dto,
    };
  }),
  decode: jest.fn().mockImplementation((token) => {
    return {
      email: 'example@gmail.com',
      otp: 1234,
    };
  }),
  set: jest.fn().mockImplementation((key: 1234, value: number, exp, sec) => {
    const token = {
      [key]: value,
    };
    redisValues.push(token);
  }),
  get: jest.fn().mockImplementation((otp) => {
    return typeof otp === 'string' ? 'example@gmail.com' : 1234;
  }),
  keys: jest.fn().mockImplementation((otp) => {
    return 1234;
  }),
};

export const MockAuthController = {
  signUp: jest.fn().mockImplementation((email: string, password: string) => ({
    email: 'example2@gmail.com',
    hash: 'ahaha',
    id: expect.any(Number),
    isVerified: false,
    role: 'user',
    salt: '1234',
  })),
  signIn: jest.fn().mockImplementation((email: string, password: string) => ({
    email: 'example@gmail.com',
    hash: 'ahaha',
    id: expect.any(Number),
    isVerified: false,
    role: 'user',
    salt: '1234',
  })),
  removeToken: jest.fn().mockImplementation((res) => {
    return true;
  }),
  confirmationEmail: jest
    .fn()
    .mockImplementation((id: number) => ({ id, name: 'John Doe' })),
  setToken: jest.fn().mockImplementation((res) => {
    return true;
  }),
  confirmationSignIn: jest
    .fn()
    .mockImplementation((id: string) => ({ id, name: 'John Doe' })),
};
