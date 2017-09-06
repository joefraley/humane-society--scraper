const parseDate = require("date-fns/parse");
const R = require("ramda");
const {
  always,
  complement,
  compose,
  dec,
  equals,
  evolve,
  findIndex,
  head,
  identity,
  isNil,
  map,
  nth,
  pickBy,
  replace,
  split,
  toLower,
  toUpper,
  trim,
  tryCatch
} = R;
const S = require("sanctuary");
const { Nothing, Just, Left, Right, Maybe } = S;
const setYear = require("date-fns/set_year");
const setMonth = require("date-fns/set_month");
const getYear = require("date-fns/get_year");
const getMonth = require("date-fns/get_month");
const getTime = require("date-fns/get_time");

const dropNonNumbers = replace(/[^0-9\.]+/g, ""); // eslint-disable-line no-useless-escape

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

module.exports = (date = Date.now()) =>
  compose(
    pickBy(complement(isNil)),
    evolve({
      adoptFee: S.compose(S.parseFloat, dropNonNumbers),
      age: parseAgeFrom(date),
      animalType: S.toLower,
      breed: S.toLower,
      color: R.compose(S.map(S.trim), S.splitOn(","), S.toLower),
      dateAvailable: S.compose(getTime, parseDate),
      description: S.trim,
      id: R.identity,
      imageUrl: R.identity,
      kennel: S.toUpper,
      location: S.toLower,
      name: R.identity,
      sex: R.compose(S.head, S.splitOn(""), S.toUpper),
      weight: S.parseFloat
    })
  );
