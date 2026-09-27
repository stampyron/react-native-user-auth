import AsyncStorage from '@react-native-async-storage/async-storage';

export const USERS_KEY = '@auth_users_store';
export const CURRENT_USER_KEY = '@auth_current_user_session';

/**
 * Retrieves all registered users from AsyncStorage.
 * @returns {Promise<Array<{name: string, email: string, password: string}>>}
 */
export async function getUsers() {
  try {
    const jsonValue = await AsyncStorage.getItem(USERS_KEY);
    if (!jsonValue) {
      return [];
    }
    const parsed = JSON.parse(jsonValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading users from AsyncStorage:', error);
    throw new Error('Failed to retrieve user data from storage.');
  }
}

/**
 * Registers a new user if the email is not already in use.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<{ success: boolean, user?: { name: string, email: string }, error?: string }>}
 */
export async function saveUser({ name, email, password }) {
  try {
    const trimmedName = name ? name.trim() : '';
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    const users = await getUsers();
    const emailExists = users.some(
      (u) => u.email && u.email.toLowerCase() === normalizedEmail
    );

    if (emailExists) {
      return {
        success: false,
        error: 'User with this email already exists',
      };
    }

    const newUser = {
      name: trimmedName,
      email: normalizedEmail,
      password,
    };

    const updatedUsers = [...users, newUser];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

    return {
      success: true,
      user: {
        name: trimmedName,
        email: normalizedEmail,
      },
    };
  } catch (error) {
    console.error('Error saving user to AsyncStorage:', error);
    return {
      success: false,
      error: 'System error, please try again.',
    };
  }
}

/**
 * Finds a user matching email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, user?: { name: string, email: string }, error?: string }>}
 */
export async function findUser(email, password) {
  try {
    const normalizedEmail = email ? email.trim().toLowerCase() : '';
    const users = await getUsers();

    const matchedUser = users.find(
      (u) =>
        u.email &&
        u.email.toLowerCase() === normalizedEmail &&
        u.password === password
    );

    if (!matchedUser) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    return {
      success: true,
      user: {
        name: matchedUser.name,
        email: matchedUser.email,
      },
    };
  } catch (error) {
    console.error('Error validating user credentials:', error);
    return {
      success: false,
      error: 'System error, please try again.',
    };
  }
}

/**
 * Retrieves the currently active user session from AsyncStorage.
 * @returns {Promise<{ name: string, email: string } | null>}
 */
export async function getCurrentUser() {
  try {
    const jsonValue = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!jsonValue) {
      return null;
    }
    return JSON.parse(jsonValue);
  } catch (error) {
    console.error('Error retrieving active session from AsyncStorage:', error);
    return null;
  }
}

/**
 * Persists the active user session into AsyncStorage.
 * @param {{ name: string, email: string }} user
 * @returns {Promise<boolean>}
 */
export async function setCurrentUser(user) {
  try {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error saving active session to AsyncStorage:', error);
    throw new Error('Failed to persist session to storage.');
  }
}

/**
 * Clears the active user session from AsyncStorage.
 * @returns {Promise<boolean>}
 */
export async function clearCurrentUser() {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return true;
  } catch (error) {
    console.error('Error removing session from AsyncStorage:', error);
    throw new Error('Failed to clear session from storage.');
  }
}

/**
 * Utility to clear all mock backend data (users and current session).
 */
export async function clearAllAuthData() {
  try {
    await AsyncStorage.multiRemove([USERS_KEY, CURRENT_USER_KEY]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data from AsyncStorage:', error);
    return false;
  }
}

