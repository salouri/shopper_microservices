const axios = require("axios");
const config = require("../config");

class ServiceClient {
  // getService gets the ip and port from service's name and version
  static async getService(servicename) {
    try {
      const url = `${config.registry.url}/registry/${servicename}/${config.registry.version}`;
      const response = await axios.get(url);
      if (!response.data[0].ip) {
        throw new Error(
          `Could not find ${servicename}:${config.registry.version}`
        );
      }
      return response.data[0];
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
