import { users } from '../../../../users/mocks/mockUsersRepository';

export const roles = ['user'];

const obj = {
  session: {
    email: 'example@gmail.com',
  },
  cookies: {
    access_token: ['secret'],
  },
};

export const mockRoleGuard = {
  get: jest.fn((Roles, method) => {
    return roles;
  }),
  findByEmail: jest.fn().mockImplementation((email) => {
    return users.filter((el) => el.email === email)[0];
  }),
  contextMethod: {
    switchToHttp() {
      return {
        getRequest() {
          return obj;
        },
      };
    },
    getHandler() {
      return null;
    },
  },
};

export const mockAuthTokenGuard = {
  contextMethod: {
    switchToHttp() {
      return {
        getRequest() {
          return obj;
        },
      };
    },
    getHandler() {
      return null;
    },
  },
  verifyAsync: jest.fn((token, secret) => {
    const secretVerified = secret[secret] === undefined ? 'secret' : secret;

    const verifiedToken = token.includes(secretVerified);
    return verifiedToken;
  }),
};
