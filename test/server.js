import { Animal } from "../src/schema";
import { get } from "axios";
import { list } from "tcomb";
import listen from "test-listen";
import main from "../src/index";
import micro from "micro";
import test from "ava";

test.beforeEach(spec => (spec.context.service = micro(main)));

test.afterEach(spec => spec.context.service.close());

test("GET: / - sends back a list of animals", async assert => {
  const uri = await listen(assert.context.service);
  const { data, status } = await get(uri, {
    params: { count: 1 }
  });
  assert.is(status, 200);
  assert.notThrows(() => list(Animal)(data));
});

test("GET: / - respects the desired count", async assert => {
  const uri = await listen(assert.context.service);
  const { data, status } = await get(uri, {
    params: { count: 1 }
  });
  assert.false(data.length > 1);
  assert.is(status, 200);
});
