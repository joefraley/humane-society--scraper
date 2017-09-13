const getMonth = require("date-fns/get_month");
const getTime = require("date-fns/get_time");
const getYear = require("date-fns/get_year");
const parseDate = require("date-fns/parse");
const R = require("ramda");
const S = require("sanctuary");
const setMonth = require("date-fns/set_month");
const setYear = require("date-fns/set_year");

const {
  always,
  compose,
  dec,
  equals,
  evolve,
  findIndex,
  nth,
  split,
  tryCatch
} = R;

const dropNonNumbers = R.replace(/[^0-9\.]+/g, ""); // eslint-disable-line no-useless-escape
const parseAdoptFee = R.compose(S.parseFloat, dropNonNumbers);

const parseAgeFrom = today =>
  compose(list => {
    const yearIndex = findIndex(equals("years"), list);
    const monthIndex = findIndex(equals("months"), list);

    const str = index => nth(dec(index), list);

    const value = compose(tryCatch(parseInt, always(0)), str);
    const monthsAgo = setMonth(
      setYear(today, getYear(today) - value(yearIndex)),
      getMonth(today) - value(monthIndex)
    );

    const result = getTime(monthsAgo);
    return result;
  }, split(" "));

const parseColor = R.compose(S.map(S.trim), S.splitOn(","), S.toLower);

module.exports = (date = Date.now()) =>
  R.compose(
    R.map(S.join),
    R.pickBy(x => S.isJust(x)),
    evolve({
      adoptFee: S.map(parseAdoptFee),
      age: S.map(x => S.Nothing(x)),
      animalType: S.map(S.toLower),
      breed: S.map(S.toLower),
      color: S.map(parseColor),
      dateAvailable: S.map(R.compose(getTime, parseDate)),
      description: S.map(S.trim),
      id: R.identity,
      imageUrl: R.identity,
      kennel: S.map(S.toUpper),
      location: R.identity,
      name: R.identity,
      sex: S.map(R.compose(S.head, S.splitOn(""), S.toUpper)),
      weight: S.map(S.parseFloat)
    })
  );
