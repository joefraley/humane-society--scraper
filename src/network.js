const axios = require("axios");
const config = require("config3");

module.exports = axios.create({
  baseURL: config.baseUrl,
  proxy: config.proxy
});
