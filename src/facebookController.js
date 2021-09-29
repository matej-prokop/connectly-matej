const VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN;

module.exports = ({ sendApi, surveyStorage }) => {
  return {
    webhook: (req, res) => {
      let body = req.body;

      console.log(`Received FB event. Object: - ${body.object}`);

      // Checks this is an event from a page subscription
      if (body.object === "page") {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function (entry) {
          // Gets the message. entry.messaging is an array, but
          // will only ever contain one message, so we get index 0
          const [webhook_event] = entry.messaging;
          console.log(
            `Processing FB page event ${JSON.stringify(webhook_event)}`
          );

          const { message, sender } = webhook_event;
          const quickReplyPayload = message?.quick_reply?.payload;
          if (quickReplyPayload && quickReplyPayload.startsWith("SURV_")) {
            surveyStorage.saveSurveyResponse({
              customerFbId: sender.id,
              response: quickReplyPayload,
            });
          } else if (message?.text === "Thanks for the service!") {
            console.log(`DEBUG: Sending a message in response to 'Thank you'`);
            const { sender } = webhook_event;
            sendApi
              .sendStandardMessage({
                recipientId: sender.id,
                text: "We are glad that you are our customer! How would you rate your experience with us so far?",
              })
              .catch((err) => {
                console.log(`Failed to send message. ${err}`);
                if (err.response) {
                  console.log(
                    `Error response: ${JSON.stringify(err.response.body)}`
                  );
                  console.log(`Error response (text): ${err.response.text}`);
                }
              });
          }
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send("EVENT_RECEIVED");
      } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
      }
    },
    verifyWebhook: (req, res) => {
      // Parse the query params
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];

      console.log(mode);
      console.log(token);
      console.log(challenge);

      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.sendStatus(403);
        }
      }
    },
  };
};
