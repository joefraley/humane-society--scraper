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

const env = propEq("NODE_ENV");
const isProduction = env("production");
const isTest = env("test");

const production = evolve({
  envName: defaultTo("production"),
  ip: always("0.0.0.0")
});

const testing = evolve({
  logStream: always(devNull())
});

const makeConfig = cond([
  [isProduction, production],
  [isTest, testing],
  [T, identity]
]);

module.exports = makeConfig({
  appVersion: pack.version,
  ip: "127.0.0.1",
  logLevel: process.env.LOG_LEVEL || "debug",
  logStream: process.stdout,
  NODE_ENV: process.env.NODE_ENV || "production",
  nodeVersion: pack.engines.node,
  pack,
  port: parseInt(process.env.PORT, 10) || 3000
});
