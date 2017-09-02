const parseDate = require("date-fns/parse");
const {
  compose,
  equals,
  findIndex,
  map,
  nth,
  prop,
  replace,
  split,
  toLower,
  trim
} = require("ramda");

const parseDateValue = key => list => {
  const labelIndex = findIndex(equals(key))(list);
  const value = nth(labelIndex - 1)(list);
  return { label: key, value: parseInt(value) || 0 };
};

const dropNonNumbers = replace(/[^0-9\.]+/g, ""); // eslint-disable-line no-useless-escape

module.exports = {
  parseAge: compose(
    list => ({
      years: prop("value")(parseDateValue("years")(list)),
      months: prop("value")(parseDateValue("months")(list))
    }),
    split(" ")
  ),
  parseColor: compose(map(trim), split(","), toLower),
  parseCurrency: compose(parseFloat, dropNonNumbers),
  parseDateAvailable: parseDate,
  parseDescription: trim,
  parseWeight: string => parseFloat(string) || 0
};
