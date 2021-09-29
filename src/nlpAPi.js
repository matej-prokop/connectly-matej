const superagent = require("superagent");

module.exports = () => ({
  verifyMessage: ({ input }) => {
    return Promise.resolve({
      body: {
        shouldPromptForReview: true,
        isReview: false,
      },
    });

    // return superagent
    //   .post(`nlp.come/nlp/message`)
    //   .set({ "Content-Type": "application/json" })
    //   .send({
    //     input,
    //   });
  },
});
