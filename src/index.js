#!/usr/bin/env node
const { compose, map, path, take } = require("ramda");
const { detailPage, resultsPage } = require("./parse-html");
const { get } = require("./network");
const { parse } = require("url");
const { withLogging, prettyLogging } = require("./logging");
const constants = require("./constants");
const cors = require("micro-cors");

const parseCountFrom = compose(path(["query", "count"]), parse);

const main = async ({ url: requestUrl }) => {
  const { data: html } = await get(constants.urls.RESULTS_PAGE);
  const allDetailUrls = resultsPage(html);
  const count = parseCountFrom(requestUrl);
  const parseEachFrom = map(detailPage);

  const results = await Promise.all(parseEachFrom(take(count, allDetailUrls)));
  const json = await JSON.stringify(results);
  return json;
};

module.exports = compose(
  prettyLogging,
  withLogging,
  cors({ allowMethods: ["GET"] })
)(main);
