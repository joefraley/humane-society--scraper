#!/usr/bin/env node

/* eslint no-console: 0 */
// use this file to do a quick ping during development
// e.g. $ node test/ping.js
const { get } = require("axios");
const config = require("config3");

get(`http://${config.ip}:${config.port}`, { params: { count: 1 } })
  .then(({ data, code }) => console.log({ data, code }))
  .catch(console.error);
