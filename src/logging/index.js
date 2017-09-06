const bole = require("bole");
const pack = require("../../package");
const config = require("config3");

module.exports = bole.output({
  level: config.logLevel,
  stream: config.logStream
})(pack.name);
