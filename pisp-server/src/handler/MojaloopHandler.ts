import Hapi, { ResponseObject } from '@hapi/hapi'

// async function lookupAndQuote(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
//   // TODO: save the public key and pass onto fido

//   return h.response(undefined).code(201)
// }

// async function transfer(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
//   // TODO: save the public key and pass onto fido

//   return h.response(undefined).code(201)
// }

/**
 * @function onUserLoggedIn
 * @description Callback for when user has logged in with DFSP
 *   and given access to PISP to view their accounts
 * 
 *   DFSP -> ml-switch -> pisp-server
 * 
 * @param {*} options 
 */
async function onUserLoggedIn(token: string) {
  //TODO:
  // 1. save this token somewhere

  // await sleep(100);

  return true;

  // return {
  //   ...options
  // }
}

/**
 * @function onDFSPLoginPage
 * @description Callback for the DFSP login page from the dfsp
 * 
 *   DFSP -> ml-switch -> pisp-server
 * 
 * @param {*} options 
 */
async function onDFSPLoginPage(token: string) {
  //TODO:
  // 1. save the login page info somewhere

  return true;

  // return {
  //   ...options
  // }
}

/**
 * @function onQuoteResponse
 * @description Callback for when a quote has been made for the transfer, and
 *   returned to the PISP to present to the user
 * 
 *   DFSP -> ml-switch -> pisp-server
 * 
 * @param {*} options 
 */
async function onQuoteResponse(opts: any) {
  //TODO: store the quote request


  return true
}

/**
 * @function onAuthRequest
 * @description Callback for when the Payer DFSP has requested authorization
 *   for the transaction request
 * 
 *   DFSP -> ml-switch -> pisp-server
 * 
 * @param {*} options 
 */
async function onAuthRequest(opts: any) {
  //TODO: 
  // 1. lookup the quote and verify it exists
  // 2. if not, return some error? or just 202 no matter what?
  // 3. 
  //Save the the auth request for the user to lookup

  return true
}


/**
 * @function onRequestReponse
 * @description Callback on a request from the DFSP. Could take a few forms:
 *  - success
 *  - failed
 *  - timeout
 * 
 *  DFSP -> ml-switch -> pisp-server
 * 
 */

async function onRequestReponse(opts: any) {

  return true;
}

export default {
  onAuthRequest,
  onDFSPLoginPage,
  onQuoteResponse,
  onRequestReponse,
  onUserLoggedIn,
}