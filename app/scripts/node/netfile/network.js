const fetch = require('node-fetch');
const pRetry = require('p-retry');

/**
 * Performs Fetch from a URL.
 * @param {string} url 
 * @param {object} options - Options for the fetch request passed
 * @returns {string}
 */
async function doFetch(url, options) {

  if (!options) {
    options = {
      headers: { 'Content-Type': 'application/json' },
    }
  }

  const fetchResponse = await fetch(url, options);

  // Abort retrying if the resource doesn't exist
  if (fetchResponse.status === 404) {
    throw new pRetry.AbortError(fetchResponse.statusText);

  // cause a retry if the response is not 200
  } else if (fetchResponse.status !== 200) {
    throw new Error(fetchResponse.statusText);
  }

  return fetchResponse.text();
}


/**
 * Fetches data from a url with retries with exponential back off.
 * @param {string} url
 * @param {object} requestOptions - passed through to doFetch
 * @param {object} [options]
 * @param {number} [options.retries = 10]
 * @returns {string}
 */
async function doRequest(url, requestOptions, {retries = 10} = {}) {

  // Call this function just before each failed attempt then retry doFetch
  const doOnEachFailedAttempt = (error) => {
    console.log(`Fetch attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
  }

  try {
    // Main function for doRequest
    return await pRetry(
      () => doFetch(url, requestOptions),
      { retries, minTimeout: 1000, onFailedAttempt: doOnEachFailedAttempt }
    );

  } catch (error) {
    console.log(error.toString());
    console.log('Error: doRequest > Fetch Retry.');
    console.log('Error: This maybe a network error or the maximum number of retries have been reached.');
    throw error;
  }

}

function getPostRequestOptions(requestBody) {
  return {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: { 'Content-Type': 'application/json' },
  };
}

module.exports = {
  doRequest,
  getPostRequestOptions,
};
