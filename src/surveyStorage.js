const store = [];

const isItLastWeek = (createdAt) => {
  // TODO: not implemented
  return true;
};

module.exports = {
  saveSurveyResponse: ({ customerFbId, response }) => {
    store.push({
      createdAt: new Date(),
      customerFbId,
      response,
    });

    // super simplification - not using an actual DB
    console.log(
      `Storing survey response from customer. Customer FB ID: ${customerFbId}, Response: ${response}`
    );
  },
  getAverageScore: ({ customerFbId }) => {
    console.log(`DEBUG storage: ${JSON.stringify(store)}`);
    console.log(`Geting score: Customer FB ID: ${customerFbId}`);

    const relevantEntries = store.filter((response) => {
      return (
        response.customerFbId === customerFbId &&
        isItLastWeek(response.createdAt)
      );
    });

    console.log(
      `Geting score: Relevant entries: ${JSON.stringify(relevantEntries)}`
    );

    const sumOfRatings = relevantEntries
      .map((el) => el.response)
      .reduce((acc, cur) => acc + cur, 0);

    return sumOfRatings / relevantEntries.length;
  },
};
