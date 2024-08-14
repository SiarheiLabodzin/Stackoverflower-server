export const users = [
  {
    id: 1,
    email: 'example@gmail.com',
    salt: '234f43f34r',
    hash: 'd323232fdas',
    isVerified: false,
    role: 'user',
  },
  {
    id: 2,
    email: 'google@gmail.com',
    salt: 'ssdadawd2',
    hash: 'dddddd',
    isVerified: true,
    role: 'admin',
  },
  {
    id: 3,
    email: 'example3@gmail.com',
    salt: 'ssdadawd2',
    hash: 'ahaha',
    isVerified: true,
    role: 'admin',
  },
];

export const userDto = {
  id: 1,
  email: 'example@gmail.com',
  salt: '234f43f34r',
  hash: 'd323232fdas',
  isVerified: false,
  role: 'user',
};

export const updateBody = {
  email: 'wowgmail.com',
  questions: [],
  answers: [],
};

interface usersBody {
  id: number;
  email: string;
  salt: string;
  hash: string;
  isVerified: boolean;
  role: string;
}

export const MockUsersRepository = {
  create: jest.fn().mockImplementation((dto) => {
    const user = {
      id: expect.any(Number),
      ...dto,
      isVerified: false,
      role: 'user',
    };
    users.push(user);
    return user;
  }),
  save: jest.fn().mockImplementation((user) => user),
  findOne: jest.fn().mockImplementation(({ where: dto }) => {
    const a = Object.keys(dto)[0];
    return users.filter((el) => el[a] === dto[a])[0];
  }),
  find: jest
    .fn()
    .mockImplementation(({}) => Promise.resolve(users.filter((el) => el))),
  remove: jest
    .fn()
    .mockImplementation((user) =>
      Promise.resolve(users.filter((el) => el !== user)),
    ),
};
