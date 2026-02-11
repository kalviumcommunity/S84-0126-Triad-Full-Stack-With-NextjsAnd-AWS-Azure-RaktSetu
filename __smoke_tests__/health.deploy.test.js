/* eslint-disable @typescript-eslint/no-require-imports */
const axios = require("axios");

const BASE_URL = process.env.DEPLOYMENT_URL;

describe("Deployment Smoke Test", () => {

  if (!BASE_URL) {
    test("Skipping deployment smoke test (DEPLOYMENT_URL not set)", () => {
      console.log("No DEPLOYMENT_URL provided");
    });
    return;
  }

  test("Health endpoint returns 200 (deployment)", async () => {
    const res = await axios.get(`${BASE_URL}/api/health`);
    expect(res.status).toBe(200);
  });

});
