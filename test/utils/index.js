import { Animal } from "../../src/schema";
import parseAnimalFrom from "../../src/utils";
import data from "../fixtures";
import test from "ava";
import { compose, omit, keys, __, has } from "ramda";

test("parseAnimalFrom", assert => {
  const testDate = new Date("01/01/2000");
  const animal = data();

  const actual = parseAnimalFrom(testDate)(animal);

  assert.notThrows(() => Animal(actual));
});

test("parseAnimalFrom - omits all nil fields", assert => {
  const testDate = new Date("01/01/2000");
  const _default = data();
  const animal = compose(omit(__, _default), keys)(_default);

  const actual = parseAnimalFrom(testDate)(animal);
  const expected = {};

  assert.deepEqual(actual, expected);
});

test("parseAnimalFrom - omits any single nil fields", assert => {
  const testDate = new Date("01/01/2000");
  const animal = omit(["age"], data());

  const actual = parseAnimalFrom(testDate)(animal);

  assert.false(has("age", actual));
});
