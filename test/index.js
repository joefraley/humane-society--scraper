import { Animal } from "../src/schema";
import { list } from "tcomb";
import { merge } from "ramda";
import listen from "test-listen";
import main from "../src/index";
import micro from "micro";
import rp from "request-promise";
import test from "ava";

const request = options =>
  rp(merge({ resolveWithFullResponse: true }, options));

test.beforeEach(spec => (spec.context.service = micro(main)));

test.afterEach(spec => spec.context.service.close());

test("server:/:GET - sends back a list of animals", async assert => {
  const uri = await listen(assert.context.service);
  const response = await request({ uri });
  const result = JSON.parse(response.body);
  assert.is(response.statusCode, 200);
  assert.notThrows(() => list(Animal)(result));
});
