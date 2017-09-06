#!/usr/bin/env node

const { get } = require("axios");
const cheerio = require("cheerio");
const {
  complement,
  compose,
  curry,
  flip,
  isNil,
  map,
  pickBy,
  take,
  toLower
} = require("ramda");
const parseAnimalFrom = require("./utils");
const { parse } = require("url");
const log = require("./logging");
const cors = require("micro-cors");
const visualize = require("micro-visualize");
const config = require("config3");

const BASE_URL = "https://www.oregonhumane.org";
const ALL_ANIMALS_URL = `${BASE_URL}/adopt?type=all`;

const selectors = {
  ANIMAL_LINK: ".animal-results .result-item a",
  DESCRIPTION: ".detail-desc",
  DETAILS: ".animal-details",
  IMAGE_URL: ".detail-image img",
  STATS: ".detail-text",
  TABLE: "table tbody"
};

const parseDetail = async detailUrl => {
  const { data } = await get(`${BASE_URL}${detailUrl}`);
  const $$ = cheerio.load(data);
  const details = $$(selectors.DETAILS);
  const stats = details.find(selectors.STATS);

  const table = stats.find(selectors.TABLE).children();

  const parseDetail = compose(toLower, key =>
    $$(table)
      .find(`th:contains("${key}")`)
      .siblings("td")
      .first()
      .text()
      .trim()
  );

  const raw = pickBy(complement(isNil), {
    adoptFee: parseDetail("Adopt Fee"),
    age: parseDetail("Age"),
    animalType: parseDetail("Type"),
    breed: parseDetail("Breed"),
    color: parseDetail("Color"),
    dateAvailable: parseDetail("Date Available"),
    description: details.find(selectors.DESCRIPTION).text(),
    id: parseDetail("Code #"),
    imageUrl: details.find(selectors.IMAGE_URL).attr("src"),
    kennel: parseDetail("Kennel"),
    location: parseDetail("Location"),
    name: stats.find("h2").text(),
    sex: parseDetail("Sex"),
    weight: parseDetail("Weight")
  });

  return parseAnimalFrom(Date.now())(raw);
};

const withLogging = fn => async (request, res) => {
  try {
    log.info(request);
    const result = await fn(request, res);
    log.info({ result });
    return result;
  } catch (error) {
    log.error(error, "error");
    throw await error;
  }
};

const prettify = compose(curry, flip)(visualize)(config.NODE_ENV);

module.exports = compose(
  prettify,
  withLogging,
  cors({ allowMethods: ["GET"] })
)(async (...args) => {
  const [req, res] = args; // eslint-disable-line no-unused-vars
  const { data } = await get(ALL_ANIMALS_URL);
  const $ = cheerio.load(data);

  const urls = $(selectors.ANIMAL_LINK)
    .map((i, anchor) => $(anchor).attr("href"))
    .toArray();

  const { query: { count = urls.length } } = parse(req.url, true);

  const needed = take(count, urls);

  const results = await Promise.all(map(parseDetail, needed));
  return await JSON.stringify(results);
});
