const ServiceClient = require("./ServiceClient");
const config = require("../config");

const log = config.log();
/** @moduleCartClient */
/**
 * client class for interacting with the  Cart service
 */
class CartServiceClient {
  static key(userId) {
    return `shopper_cart:${userId}`;
  }

  static client() {
    return config.redis.client;
  }

  /**
   * Get all items from the database, sorted in descending order by creation time
   * @returns {Promise<Array>} - A promise that resolves to an array of Items
   */
  static async getAll(userId) {
    try {
      const result = await ServiceClient.callService("cart-service", {
        method: "get",
        url: `/items/${userId}`
      });
      return result;
    } catch (error) {
      log.error(error);
      return [];
    }
  }

  /**
   * Get a single item from the database
   * @param {string} itemId - The id of the item to retrieve
   * @returns {Promise<Object>} - A promise that resolves to an Item object
   */
  static async getOne(itemId) {
    try {
      const result = await ServiceClient.callService("cart-service", {
        method: "get",
        url: `/items/${itemId}`
      });
      return result;
    } catch (error) {
      log.error(error);
      return null;
    }
  }

  /**
   * Add an item to the user's cart
   * @param {string} itemId - The ID of the item to add
   * @returns {Promise<number>} - A promise that resolves to the new quantity of
   * the item in the cart
   */
  static async add(userId, itemId) {
    try {
      const result = await ServiceClient.callService("cart-service", {
        method: "post",
        url: `/items/${userId}`,
        data: { itemId }
      });
      return result;
    } catch (error) {
      log.error(error);
      throw new Error(error);
    }
  }

  /**
   * Remove an item from the database
   * @param {string} itemId - The id of the item to remove
   * @returns {Promise<Object>} - A promise that resolves to the deletion result
   */
  static async remove(userId, itemId) {
    try {
      const result = await ServiceClient.callService("cart-service", {
        method: "delete",
        url: `/items/${userId}/${itemId}`
      });
      return result;
    } catch (error) {
      log.error(error);
      return [];
    }
  }
}

module.exports = CartServiceClient;
