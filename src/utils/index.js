const parseDate = require("date-fns/parse");
const {
  always,
  complement,
  compose,
  dec,
  defaultTo,
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
  compose(
    pickBy(complement(isNil)),
    evolve({
      adoptFee: compose(parseFloat, dropNonNumbers),
      age: parseAgeFrom(date),
      animalType: toLower,
      breed: toLower,
      color: compose(map(trim), split(","), toLower),
      dateAvailable: compose(getTime, parseDate),
      description: trim,
      id: identity,
      imageUrl: identity,
      kennel: toUpper,
      location: toLower,
      name: identity,
      sex: compose(head, split(""), toUpper, defaultTo("")),
      weight: parseFloat
    })
  );
