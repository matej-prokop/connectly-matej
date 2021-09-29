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

const surveyStorage = require("./surveyStorage");

const shopifyController = require("./shopifyController")({ sendApi });
const facebookController = require("./facebookController")({
  sendApi,
  surveyStorage,
});

const app = express();

app.use(express.json());

app.listen(process.env.PORT || 3111, () => console.log("webhook is listening"));

app.get("/health", (req, res) => {
  res.status(200).send("Matej - OK");
});

app.post("/shopify/webhook", shopifyController.webhook);
app.post("/fb/webhook", facebookController.webhook);
app.get("/fb/webhook", facebookController.verifyWebhook);
