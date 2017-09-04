import { Animal } from "../../src/schema";
import parseAnimalFrom from "../../src/utils";
import data from "../fixtures";
import test from "ava";

test("parseAnimalFrom", assert => {
  const testDate = new Date("01/01/2000");
  const animal = data();

  const actual = parseAnimalFrom(testDate)(animal);
  assert.notThrows(() => Animal(actual));
});
