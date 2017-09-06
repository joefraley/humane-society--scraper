#!/usr/bin/env node

/* eslint no-console: 0 */

// use this file to do a quick ping during development
// e.g. $ node test/ping.js
const { get } = require("axios");
const config = require("config3");

const count = process.argv[2] || 1;

get(`${config.protocol}://${config.ip}:${config.port}`, {
  params: { count }
})
  .then(({ data, code }) => console.log({ data, code }))
  .catch(console.error);
