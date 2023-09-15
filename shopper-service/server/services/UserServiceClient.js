/** @module UserService */
const ServiceClient = require("./ServiceClient");

/**
 * Service class for managing users
 */
class UserServiceClient {
  /**
   * Get all users
   * @returns {Promise<Array>} - A promise that resolves to an array of users
   */
  static async getAll() {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "get",
        url: "/users"
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Get a user by ID
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<Object|null>} - A promise that resolves to the user, or
   * null if no user was found
   */
  static async getOne(userId) {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "get",
        url: `/users/${userId}`
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Create a new user
   * @param {Object} data - The data for the new user
   * @returns {Promise<Object>} - A promise that resolves to the new user
   */
  static async create(data) {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "post",
        url: "/users",
        data
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Authenticate a user
   * @param {string} email - The email address
   * @param {string} password - The email password
   * @returns {Promise<Object>} - A promise that either returns the authenticated user or false
   */
  static async authenticate(email, password) {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "post",
        url: "/users/authenticate",
        data: { email, password }
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Update a user's data
   * @param {string} userId - The ID of the user to update
   * @param {Object} data - The new data for the user
   * @returns {Promise<Object>} - A promise that resolves to the updated user
   */
  static async update(userId, data) {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "put",
        url: `/users/${userId}`,
        data
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Remove a user
   * @param {string} userId - The ID of the user to remove
   * @returns {Promise<Object>} - A promise that resolves to the result of the
   * delete operation
   */
  static async remove(userId) {
    try {
      const result = await ServiceClient.callService("user-service", {
        method: "delete",
        url: `/users/${userId}`
      });
      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}

module.exports = UserServiceClient;
