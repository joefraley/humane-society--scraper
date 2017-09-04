const { get } = require("axios");
const cheerio = require("cheerio");
const {
  complement,
  compose,
  isNil,
  map,
  pickBy,
  take,
  toLower
} = require("ramda");
const parseAnimalFrom = require("./utils");
const { parse } = require("url");

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

module.exports = async req => {
  const { data } = await get(ALL_ANIMALS_URL);
  const $ = cheerio.load(data);

  const urls = $(selectors.ANIMAL_LINK)
    .map((i, e) => $(e).attr("href"))
    .toArray();

  const { query: { count = urls.length } } = parse(req.url, true);

  const needed = take(count, urls);

  const results = await Promise.all(map(parseDetail, needed)); // eslint-disable-line no-undef

  return await JSON.stringify(results);
};
