const supertest = require("supertest");
const nock = require("nock");

// this start my bot application
require("../src/app");

const FACEBOOK_API_URL = process.env.FB_API_URL;
const FB_ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN;

describe("<shopifyIntegration>", () => {
  afterEach(async () => {
    nock.cleanAll();
  });

  it("ClosedOrder event triggers bot which sends survey to customer", async () => {
    const scope = nock(FACEBOOK_API_URL)
      .post("/v12.0/me/messages")
      .reply(200, {});

    const capturedRequestPromise = new Promise((resolve) => {
      scope.on("request", (req) => {
        resolve(req);
      });
    });

    await supertest(`localhost:3111`)
      .post(`/shopify/webhook`)
      .send({
        eventType: "OrderCompleted",
        fbRecipientId: "6808083265883540",
        orderId: 123456,
      })
      .expect(200, { status: 200 });

    const capturedReq = await capturedRequestPromise;
    expect(capturedReq.getHeader("access_token")).to.equal(FB_ACCESS_TOKEN);
  });
});
