import micro from "micro";
import test from "ava";
import listen from "test-listen";
import rp from "request-promise";
import main from "../src/index";
import { merge } from "ramda";

const request = options =>
  rp(merge({ resolveWithFullResponse: true }, options));

test("server:/:GET - sends 200", async assert => {
  const service = micro(main);
  const uri = await listen(service);
  const response = await request({ uri });

  assert.is(response.statusCode, 200);
  service.close();
});
