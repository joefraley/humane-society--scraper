import parseAnimalFrom from "../../src/utils";
import data from "../fixtures";
import test from "ava";
import R from "ramda";
import S from "sanctuary";

const testDate = new Date("01/01/2000");
const parseAnimal = parseAnimalFrom(testDate);

test("returns a vaild animal", assert => {
  const testAnimal = R.map(S.toMaybe, data());
  const results = parseAnimal(testAnimal);

  const expected = S.keys(data());
  const actual = S.keys(results);

  assert.deepEqual(actual, expected);
});

test("does not omit Just(value)'s", assert => {
  const noAge = R.omit(["age"]);
  const animal = noAge(data());
  const actual = parseAnimal(animal);
});

test("omits all Nothing's", assert => {
  const animal = S.map(R.always(S.Nothing), data({}));
  const actual = parseAnimal(animal);
  const expected = {};
});

test("omits any Nothing", assert => {
  const noAge = R.omit(["age"]);
  const animal = noAge(data());
  const actual = parseAnimal(animal);
});
