const network = require('./network');

function getCampaignAgenciesRequestBody(includeTestAgencies) {

  return {
    "IncludeTestAgencies": includeTestAgencies
  };

}

/**
 * @param {boolean} includeTestAgencies
 */
async function getAgencies(includeTestAgencies = false) {
  const campaignAgenciesUrl = 'https://www.netfile.com:443/Connect2/api/public/campaign/agencies';

  const requestBody = getCampaignAgenciesRequestBody(includeTestAgencies);
  const options = network.getPostRequestOptions(requestBody);

  const response = JSON.parse( await network.doRequest(campaignAgenciesUrl, options) );

  const agencies = response.agencies;

  return agencies;
}

module.exports = {
  getAgencies,
}
