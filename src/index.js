const { get } = require("axios");
const cheerio = require("cheerio");
const { compose, map, take, toLower } = require("ramda");
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

  const table = stats
    .find(selectors.TABLE)
    .children()
    .toArray();

  const parseDetail = compose(toLower, index =>
    $$(table[index])
      .find("td")
      .text()
  );

  const raw = {
    adoptFee: parseDetail(1),
    age: parseDetail(6),
    animalType: parseDetail(2),
    breed: parseDetail(3),
    color: parseDetail(5),
    dateAvailable: parseDetail(0),
    description: details.find(selectors.DESCRIPTION).text(),
    id: parseDetail(10),
    imageUrl: details.find(selectors.IMAGE_URL).attr("src"),
    kennel: parseDetail(9),
    location: parseDetail(8),
    name: stats.find("h2").text(),
    sex: parseDetail(4),
    weight: parseDetail(7)
  };

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
