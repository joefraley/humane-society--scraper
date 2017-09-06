import { Animal } from "../src/schema";
import { list } from "tcomb";
import { merge } from "ramda";
import listen from "test-listen";
import main from "../src/index";
import micro from "micro";
import rp from "request-promise";
import test from "ava";

const request = options =>
  rp(merge({ resolveWithFullResponse: true, json: true }, options));

test.beforeEach(spec => (spec.context.service = micro(main)));

test.afterEach(spec => spec.context.service.close());

test("GET: / - sends back a list of animals", async assert => {
  const uri = await listen(assert.context.service);
  const { body, statusCode } = await request({
    uri,
    qs: { count: 1 }
  });
  assert.is(statusCode, 200);
  assert.notThrows(() => list(Animal)(body));
});

test("GET: / - respects the desired count", async assert => {
  const uri = await listen(assert.context.service);
  const { body, statusCode } = await request({
    uri,
    qs: { count: 1 }
  });
  assert.false(body.length > 1);
  assert.is(statusCode, 200);
});
