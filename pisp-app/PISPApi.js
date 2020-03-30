import { sleep } from './util.js'
import FidoAPI from './FidoApi.js'
import Config from './Config.js';


/**
 * @file PISPApi.js
 * @description 
 *   The API for talking to the PISP-Server. All calls go through
 *   the PISP Server, but some are forwarded onto mojaloop and routed
 *   to different services, such as the `central-fido` server and DFSPs
 * @author Lewis Daly
 */


/* --- Generic PISP Functions --- */

/**
 * @function mock_loginToPISP
 * @description Logs into the PISP. This is a mock function that assumes a user
 *   already exists. Outside the scope of this demo (and the Mojaloop API)
 * 
 *   pisp-app ---> pisp-server
 * 
 * @param {*} options 
 */
async function mock_loginToPISP(options) {
  await sleep(1000);

  return {
    ...options
  }
}

/**
 * @function mock_getDFSPLoginPage
 * @param {*} options 
 */


/**
 * @function getDFSPAccountMetadata
 * @description Using the token supplied from `onUserLoggedIn`, ask
 *   the DFSP for a list of accounts and balances on behalf of the user
 * 
 *   pisp-app -> pisp-server -> ml-switch -> DFSP
 * 
 * @param {*} options 
 */
async function getDFSPAccountMetadata() {
  /*
    This endpoint is conditional on user login. Perhaps it should fail
    if the user hasn't logged in yet

    On the client, side, the easiest thing to do for the demo is poll
    this and wait until we get an answer back. We'll likely need some controls
    around how old the data is, but that will be left up to the PISP to implement

    For the purposes of the demo, we will use this endpoint for both the initial 
    linking and accessing metadata before initiating a transfer, but these 2 things
    may end up looking different depending on the authorization models we choose to
    go with
  */

  // TODO: replace with MojaloopApi call
  // 1. Lookup if we have the token.
  // 2. If not, fail with some error code
  // 3. If we do have the token, call MojallopApi.getParty and pass on the token
  // 4. Return the account metadata from getParty
  //

  
  await sleep(1);

  const mockAccounts = [
    {
      id: '9876',
      name: 'xxxx9876',
      nickname: 'Savings',
      balance: '$1,002.24'
    },
    {
      id: '1234',
      name: 'xxxx1234',
      nickname: 'Spendings',
      balance: '$52.13'
    },
    {
      id: '5678',
      name: 'xxxx5678',
      nickname: 'Chequing',
      balance: '$100.34'
    },
  ]

  return mockAccounts
}


/* --- Mojaloop Functions --- */

/**
 * @function getQuoteAndPendingAuth
 * @description Get a saved quote and pending authorization object from the PISP Server. 
 *  This relies on `onQuoteResponse` and `onAuthRequest` to have been called first.
 *
 *   pisp-app -> pisp-server
 *
 * 
 * @param {*} quoteRequestOptions
 * @param {string} quoteRequestOptions.id - The transfer id
 * 
 */
async function getQuoteAndPendingAuth(quoteRequestOptions) {
  // TODO: implement this...
  // 1. Lookup the quote to see if we've received a response yet
  // 2. if not, return a 404
  // 3. if we have a quote, make sure we have the authorization object as well
  // 4. if so, return the quote response and authorization obejct
  //
  // For the sake of the demo, the app can poll the server on a regular interval
  // as it waits for the response to come back
  
  // These are just mock values for now, and are likely to change
  // We will need the condition in here I think...
  return {
    partyName: 'C. Stevens',
    fee: quoteRequestOptions.amount * 0.05 + 1
  }
}

/**
 * @function sendTransfer
 * @description Send the transfer, with the challenge signed by the FIDO
 *
 *   pisp-app -> pisp-server -> ml-switch
 *
 * 
 * @param {*} sendTranferOptions
 * Note: in this example, we save the credentialId locally, but I think it's more canonical for
 * the FIDO server to keep track of this for us.  
 *
 */
async function sendTransfer(credentialId) {
  await sleep(1200)

  const assertionOptions = { 
    challengeString: 'challenge:1234', //this should be the confirmation from the quote?
    // credentialId: 'credential:1234', //this should be saved during the registration step
    credentialId,
  }

  const assertion = await FidoAPI.getAssertion(assertionOptions)

  //TODO: send off to the PISP to make the actual transaction
  // PISP must forward onto switch and FIDO server to verify the tx is valid

  return true;
}


/* ---  FIDO Server Functions --- */

/**
 * @function getCredServerOptions
 * @description Gets the necessary things we need from the server.
 *
 *   pisp-app -> pisp-server -> ml-switch -> central-fido
 *
 * @todo: Implement fully
 */
async function getCredServerOptions() {
  const url = `${Config.host}/fido/options`
  const options = { }

  const rawResponse = await fetch(url, options)
  return rawResponse.json()
}

/**
 * @function registerPublicKey
 * @description Registers the public key created locally with the FIDO server
 *
 *   pisp-app -> pisp-server -> ml-switch -> central-fido
 *
 * @param {PublicKeyCredential} publicKey
 */
async function registerPublicKey(publicKey) {
  //TODO: talk to FIDO server, give them the PublicKeyCredential the browser made for us

  return true;
}

/* ---  Callbacks from Mojaloop Switch --- */

/**
 * @function onUserLoggedIn
 * @description Callback for when user has logged in with DFSP
 *   and given access to PISP to view their accounts
 * 
 *   DFSP -> ml-switch -> pisp-server
 * 
 * @param {*} options 
 */
async function onUserLoggedIn(token) {
  //TODO:
  // 1. save this token somewhere

  await sleep(100);

  return {
    ...options
  }
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



export default {
  getCredServerOptions,
  mock_loginToPISP,
  getDFSPAccountMetadata,
  registerPublicKey,
  onQuoteResponse,
  onAuthRequest,
  onUserLoggedIn,
  sendTransfer,
  
}