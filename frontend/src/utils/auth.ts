/**
 * Authentication utility functions
 */

import { routes } from "../routes/routes";

interface User {
  id: string;
  username: string;
  roles: string[];
}

interface AuthData {
  access_token: string;
  user: User;
}

/**
 * Check if user is authenticated by verifying JWT token in localStorage
 */
export const isAuthenticated = (): boolean => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return false;

    const userData = JSON.parse(user) as AuthData;
    // Check if token exists
    if (!userData.access_token) return false;

    // You could add token expiration validation here if your JWT includes exp claim
    // For example:
    // const tokenData = jwtDecode(userData.access_token);
    // if (tokenData.exp * 1000 < Date.now()) return false;

    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

/**
 * Get the current user data from localStorage
 */
export const getCurrentUser = (): AuthData | null => {
  try {
    const user = localStorage.getItem("user");
    if (!user) return null;

    return JSON.parse(user) as AuthData;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Logout user by removing data from localStorage
 */
export const logout = () => {
  localStorage.removeItem("user");
  // Redirect to login page
  window.location.href = routes.auth.signIn;
};
