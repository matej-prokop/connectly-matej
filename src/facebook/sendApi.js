const superagent = require("superagent");

const SURVEY_QUICK_REPLIES = [
  {
    content_type: "text",
    title: "\uD83D\uDE00",
    payload: "SURV_Good",
  },
  {
    content_type: "text",
    title: "\uD83D\uDE42",
    payload: "SURV_Average",
  },
  {
    content_type: "text",
    title: "\uD83D\uDE41",
    payload: "SURV_Bad",
  },
];

const sendMessageRaw = ({ accessToken, fbApiUrl, payload }) => {
  console.log(`DEBUG - Sending message. Payload: ${JSON.stringify(payload)}`);

  return superagent
    .post(`${fbApiUrl}/v12.0/me/messages`)
    .query({ access_token: accessToken })
    .set({ "Content-Type": "application/json" })
    .send(payload);
};

module.exports = ({ accessToken, fbApiUrl }) => ({
  sendStandardMessage: ({ recipientId, text }) => {
    const payload = {
      messaging_type: "RESPONSE",
      recipient: {
        id: recipientId,
      },
      message: {
        text,
        quick_replies: SURVEY_QUICK_REPLIES,
      },
    };

    return sendMessageRaw({
      accessToken,
      fbApiUrl,
      payload,
    });
  },
  sendTaggedMessage: ({ recipientId, text, tag = "ACCOUNT_UPDATE" }) => {
    // https://developers.facebook.com/docs/messenger-platform/send-messages/message-tags
    const payload = {
      messaging_type: "MESSAGE_TAG",
      tag,
      recipient: {
        id: recipientId,
      },
      message: {
        text,
        quick_replies: SURVEY_QUICK_REPLIES,
      },
    };

    return sendMessageRaw({
      accessToken,
      fbApiUrl,
      payload,
    });
  },
});
