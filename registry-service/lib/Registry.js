class Registry {
  constructor() {
    this.services = []; // in-memory database
    this.timeout = 15; // seconds
  }

  register(name, version, ip, port) {
    const key = name + version + ip + port;
    if (!this.services.includes(key)) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(Date.now() / 1000);

      this.services[key].ip = ip;
      this.services[key].name = name;
      this.services[key].port = port;
      this.services[key].version = version;
      console.log(t`Added service: ${name}, ${version}, at ${ip}:${port}`);
    } else {
      this.services[key].timestamp = Math.floor(Date.now() / 1000);
      console.log(t`Updated service: ${name}, ${version}, at ${ip}:${port}`);
    }
    return key;
  }
} // class

module.exports = Registry;
