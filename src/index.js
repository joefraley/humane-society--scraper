const { get } = require("axios");
const cheerio = require("cheerio");
const { compose, toLower } = require("ramda");
const {
  parseAge,
  parseColor,
  parseCurrency,
  parseDateAvailable,
  parseDescription,
  parseWeight
} = require("./utils");

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

const fetchAllAnimals = async () => await get(ALL_ANIMALS_URL);

module.exports = async () => {
  const { data } = await fetchAllAnimals();
  const $ = cheerio.load(data);

  const urls = $(selectors.ANIMAL_LINK).map((i, e) => $(e).attr("href"));

  const detailUrl = `${BASE_URL}${urls[0]}`;
  const { data: detail } = await get(detailUrl);

  const $$ = cheerio.load(detail);
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

  const result = {
    adoptFee: compose(parseCurrency, parseDetail)(1),
    age: compose(parseAge, parseDetail)(6),
    animalType: parseDetail(2),
    breed: parseDetail(3),
    color: compose(parseColor, parseDetail)(5),
    dateAvailable: compose(parseDateAvailable, parseDetail)(0),
    description: parseDescription(details.find(selectors.DESCRIPTION).text()),
    id: parseDetail(10),
    imageUrl: details.find(selectors.IMAGE_URL).attr("src"),
    kennel: parseDetail(9),
    location: parseDetail(8),
    name: stats.find("h2").text(),
    sex: parseDetail(4),
    weight: compose(parseWeight, parseDetail)(7)
  };

  return await JSON.stringify(result);
};
