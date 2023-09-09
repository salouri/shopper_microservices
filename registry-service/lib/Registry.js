/* eslint-disable no-restricted-syntax */
const semver = require("semver");

class Registry {
  constructor() {
    this.services = {}; // in-memory database
    this.timeout = 15; // seconds
  }

  // eslint-disable-next-line class-methods-use-this
  getKey(name, version, ip, port) {
    const key = `${name}${version}${ip}${port}`;
    return key;
  }

  register(name, version, ip, port) {
    this.cleanup();
    const key = this.getKey(name, version, ip, port);
    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(Date.now() / 1000);

      this.services[key].ip = ip;
      this.services[key].name = name;
      this.services[key].port = port;
      this.services[key].version = version;
      console.log(`Added service: ${name}, ${version}, at ${ip}:${port}`);
    } else {
      this.services[key].timestamp = Math.floor(Date.now() / 1000);
      console.log(`Updated service: ${name}, ${version}, at ${ip}:${port}`);
    }
    return key;
  }

  unregister(name, version, ip, port) {
    this.cleanup();
    const key = this.getKey(name, version, ip, port);
    if (this.services[key]) {
      delete this.services[key];
      console.log(`Service deleted`);
    }
    console.log("Service not found");
    return key;
  }

  find(name, version) {
    this.cleanup();
    return Object.values(this.services).filter(
      (srv) =>
        srv.name === name &&
        semver.satisfies(srv.version, version || `${version}.x`)
    );
  }

  cleanup() {
    const currentTime = Date.now() / 1000;
    Object.keys(this.services).forEach((key) => {
      const age = Math.abs(currentTime - this.services[key].timestamp);
      if (age >= this.timeout) {
        delete this.services[key];
        console.log(`Service with key ${key} has expired`);
      }
    });
  }
} // class

module.exports = Registry;
