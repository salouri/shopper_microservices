const axios = require("axios");
const config = require("../config");

class ServiceClient {
  static async getService(servicename) {
    try {
      const response = await axios.get(
        `${config.registry.url}/registry/${servicename}/${config.registry.version}`
      );
      if (!response.data.ip) {
        throw new Error(
          `Could not find ${servicename}:${config.registry.version}`
        );
      }
      return response.data;
    } catch (error) {
      const errorMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      throw new Error(errorMsg);
    }
  }

  // @param {Object} requestOptions -  {method:'', url:''}
  static async callService(servicename, requestOptions) {
    const { ip, port } = await this.getService(servicename);
    // eslint-disable-next-line no-param-reassign
    requestOptions.url = `http://${ip}:${port}${requestOptions.url}`;
    try {
      const serviceInfo = await axios(requestOptions);
      if (!serviceInfo.data.ip) {
        throw new Error(
          `Could not find ${servicename}:${config.registry.version}`
        );
      }
      return serviceInfo.data;
    } catch (error) {
      const errorMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message;
      throw new Error(errorMsg);
    }
  }
}

module.exports = ServiceClient;
