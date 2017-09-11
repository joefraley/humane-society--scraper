const devNull = require("dev-null");
const pack = require("./package");
const {
  always,
  cond,
  defaultTo,
  evolve,
  identity,
  propEq,
  T
} = require("ramda");

const envIs = propEq("NODE_ENV");
const isProduction = envIs("production");
const isTest = envIs("test");

const production = evolve({
  envName: defaultTo("production"),
  ip: always("0.0.0.0"),
  logLevel: always("debug")
});

const testing = evolve({
  logStream: always(devNull()),
  proxy: {
    host: "127.0.0.1",
    port: 8888
  }
});

const makeConfig = cond([
  [isProduction, production],
  [isTest, testing],
  [T, identity]
]);

module.exports = makeConfig({
  appVersion: pack.version,
  baseUrl: "http://www.oregonhumane.org",
  proxy: false,
  ip: "127.0.0.1",
  logLevel: process.env.LOG_LEVEL || "error",
  logStream: process.stdout,
  NODE_ENV: process.env.NODE_ENV || "production",
  nodeVersion: pack.engines.node,
  pack,
  port: parseInt(process.env.PORT, 10) || 3000,
  protocol: "http"
});
