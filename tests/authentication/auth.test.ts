import { test } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { app } from "../../src/app";
import logger from "../../src/utils/loggerUtils";

const runTests = async () => {
  await test("GET /api/v1/health", async () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const res = await request(app).get("/api/v1/health");
    assert.strictEqual(res.status, 200);
  });
};

// Run the tests and handle results
runTests()
  .then(() => {
    logger.info("All tests passed");
  })
  .catch((err) => {
    logger.error("Tests encountered an error", err);
  });
