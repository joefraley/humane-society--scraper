const parseDate = require("date-fns/parse");
const {
  always,
  compose,
  dec,
  either,
  equals,
  evolve,
  findIndex,
  head,
  identity,
  ifElse,
  isEmpty,
  isNil,
  map,
  nth,
  replace,
  split,
  toLower,
  toUpper,
  trim,
  tryCatch
} = require("ramda");
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
  evolve({
    adoptFee: compose(parseFloat, dropNonNumbers),
    age: parseAgeFrom(date),
    animalType: compose(toLower, identity),
    breed: compose(toLower, identity),
    color: compose(map(trim), split(","), toLower),
    dateAvailable: compose(getTime, parseDate),
    description: trim,
    id: identity,
    imageUrl: identity,
    kennel: compose(toLower, identity),
    location: compose(toLower, identity),
    name: identity,
    sex: compose(
      ifElse(either(isEmpty, isNil), always("NA"), toUpper),
      head,
      split(""),
      ifElse(isNil, always(""), identity)
    ),
    weight: string => parseFloat(string) || 0
  });
