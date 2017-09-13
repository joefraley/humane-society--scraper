const { compose } = require("ramda");
const { get } = require("./network");
const constants = require("./constants");
const cheerio = require("cheerio");
const parseAnimalFrom = require("./utils");
const S = require("sanctuary");

const detailPage = async detailUrl => {
  const { data } = await get(`${detailUrl}`);
  const $$ = cheerio.load(data);
  const details = $$(constants.selectors.DETAILS);
  const stats = details.find(constants.selectors.STATS);

  const table = stats.find(constants.selectors.TABLE).children();

  const parseDetail = S.compose(S.of(S.Maybe), key =>
    $$(table)
      .find(`th:contains("${key}")`)
      .siblings("td")
      .first()
      .text()
      .trim()
  );

  const raw = {
    adoptFee: parseDetail("Adopt Fee"),
    age: parseDetail("Age"),
    animalType: parseDetail("Type"),
    breed: parseDetail("Breed"),
    color: parseDetail("Color"),
    dateAvailable: parseDetail("Date Available"),
    description: details.find(constants.selectors.DESCRIPTION).text(),
    id: parseDetail("Code #"),
    imageUrl: details.find(constants.selectors.IMAGE_URL).attr("src"),
    kennel: parseDetail("Kennel"),
    location: parseDetail("Location"),
    name: stats.find("h2").text(),
    sex: parseDetail("Sex"),
    weight: parseDetail("Weight")
  };

  return parseAnimalFrom(Date.now())(raw);
};

const resultsPage = html => {
  const $ = cheerio.load(html);

  return $(constants.selectors.ANIMAL_LINK)
    .map((i, anchor) => $(anchor).attr("href"))
    .toArray();
};

module.exports = {
  detailPage,
  resultsPage
};
