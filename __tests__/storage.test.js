import { jest } from '@jest/globals';

let mockStore = {};

jest.unstable_mockModule('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(async (key) => mockStore[key] || null),
    setItem: jest.fn(async (key, value) => {
      mockStore[key] = String(value);
    }),
    removeItem: jest.fn(async (key) => {
      delete mockStore[key];
    }),
    multiRemove: jest.fn(async (keys) => {
      keys.forEach((k) => delete mockStore[k]);
    }),
  },
}));

let getUsers;
let saveUser;
let findUser;
let getCurrentUser;
let setCurrentUser;
let clearCurrentUser;
let clearAllAuthData;

describe('Storage & Mock Backend Utility Suite', () => {
  beforeAll(async () => {
    const storage = await import('../src/utils/storage');
    getUsers = storage.getUsers;
    saveUser = storage.saveUser;
    findUser = storage.findUser;
    getCurrentUser = storage.getCurrentUser;
    setCurrentUser = storage.setCurrentUser;
    clearCurrentUser = storage.clearCurrentUser;
    clearAllAuthData = storage.clearAllAuthData;
  });

  beforeEach(() => {
    mockStore = {};
    jest.clearAllMocks();
  });

  describe('User Registration (saveUser)', () => {
    it('successfully saves a new user', async () => {
      const result = await saveUser({
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'password123',
      });

      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        name: 'Alice Smith',
        email: 'alice@example.com',
      });

      const users = await getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].name).toBe('Alice Smith');
      expect(users[0].email).toBe('alice@example.com');
      expect(users[0].password).toBe('password123');
    });

    it('rejects duplicate email registrations (case-insensitive)', async () => {
      await saveUser({
        name: 'Alice Smith',
        email: 'alice@example.com',
        password: 'password123',
      });

      const duplicateResult = await saveUser({
        name: 'Alice Duplicate',
        email: 'ALICE@EXAMPLE.COM',
        password: 'differentPassword',
      });

      expect(duplicateResult.success).toBe(false);
      expect(duplicateResult.error).toBe('User with this email already exists');

      const users = await getUsers();
      expect(users).toHaveLength(1);
    });
  });

  describe('User Authentication (findUser)', () => {
    beforeEach(async () => {
      await saveUser({
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'secretPassword',
      });
    });

    it('authenticates user with correct email and password', async () => {
      const result = await findUser('bob@example.com', 'secretPassword');
      expect(result.success).toBe(true);
      expect(result.user).toEqual({
        name: 'Bob Johnson',
        email: 'bob@example.com',
      });
    });

    it('authenticates case-insensitively for email', async () => {
      const result = await findUser('BOB@EXAMPLE.COM', 'secretPassword');
      expect(result.success).toBe(true);
      expect(result.user.name).toBe('Bob Johnson');
    });

    it('rejects incorrect password', async () => {
      const result = await findUser('bob@example.com', 'wrongPassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    it('rejects non-existent email', async () => {
      const result = await findUser('nobody@example.com', 'secretPassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });
  });

  describe('Session Management', () => {
    it('sets, retrieves, and clears active session', async () => {
      expect(await getCurrentUser()).toBeNull();

      const testUser = { name: 'Charlie', email: 'charlie@test.com' };
      await setCurrentUser(testUser);

      const retrieved = await getCurrentUser();
      expect(retrieved).toEqual(testUser);

      await clearCurrentUser();
      expect(await getCurrentUser()).toBeNull();
    });

    it('clears all auth data using clearAllAuthData', async () => {
      await saveUser({ name: 'Dan', email: 'dan@test.com', password: '123' });
      await setCurrentUser({ name: 'Dan', email: 'dan@test.com' });

      await clearAllAuthData();

      expect(await getUsers()).toEqual([]);
      expect(await getCurrentUser()).toBeNull();
    });
  });
});
