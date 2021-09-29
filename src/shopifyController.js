module.exports = ({ sendApi }) => {
  return {
    // Note: this could read events from some MQ - but using HTTP API for simplicity
    // Note: although this should be internal endpoint - it isn't protected in any way
    webhook: (req, res) => {
      const { body } = req;

      if (body.eventType === "OrderCompleted") {
        // Note: assuming that there is Connectly system that handles the Shopify webhook and also contains the mapping from Shopify Id to Facebook id for the customer
        const { fbRecipientId, orderId } = body;

        console.log(
          `Going to ask customer about experience with completed order`
        );

        sendApi
          .sendTaggedMessage({
            recipientId: fbRecipientId,
            text: `Thank you for completing order #${orderId}. Please rate how was your shopping experience?`,
          })
          .then(() => {
            res.status(200).send({ status: 200 });
          })
          .catch((err) => {
            console.log(
              `Failed to ask for experience with completed order. Customer: ${fbRecipientId}, Order: ${orderId}`,
              err
            );
            res
              .status(500)
              .send({ status: 500, message: "Failed to process event" });
          });
      } else {
        res.status(200).send({ status: 200 });
      }
    },
  };
};
