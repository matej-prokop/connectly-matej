module.exports = {
  saveSurveyResponse: ({ customerFbId, response }) => {
    // super simplification - not using an actual DB
    console.log(
      `Storing survey response from customer. Customer FB ID: ${customerFbId}, Response: ${response}`
    );
  },
};
