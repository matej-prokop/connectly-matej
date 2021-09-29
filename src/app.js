"use strict";

const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

// Imports dependencies and set up http server
const express = require("express");
const sendApi = require("./facebook/sendApi")({
  accessToken: process.env.FB_ACCESS_TOKEN,
  fbApiUrl: process.env.FB_API_URL,
});
const nlpApi = require("./nlpAPi")();

const surveyStorage = require("./surveyStorage");

const shopifyController = require("./shopifyController")({ sendApi });
const facebookController = require("./facebookController")({
  sendApi,
  surveyStorage,
  nlpApi,
});

const app = express();

app.use(express.json());

app.listen(process.env.PORT || 3111, () => console.log("webhook is listening"));

app.get("/health", (req, res) => {
  res.status(200).send("Matej - OK");
});

app.get("/score", (req, res) => {
  const customerId = req.query["customerId"];

  const result = surveyStorage.getAverageScore({ customerFbId: customerId });

  res.status(200).send({ avgRating: result });
});

app.post("/shopify/webhook", shopifyController.webhook);
app.post("/fb/webhook", facebookController.webhook);
app.get("/fb/webhook", facebookController.verifyWebhook);
