import { sleep } from './util.js'
import FidoAPI from './FidoApi.js'


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
 * @description Logs into the PISP. This is a mock function so assumes a user
 *   already exists
 * @param {*} options 
 */
async function mock_loginToPISP(options) {
  console.log("mock logging in to pisp with options", options)
  await sleep(1000);

  return {
    ...options
  }
}



/* --- Mojaloop Functions --- */

/**
 * @function getQuote
 * @description Get a quote from the PISP Server
 * @param {*} quoteRequestOptions
 * @param {string} quoteRequestOptions.msidn - The party to send to
 * @param {string} quoteRequestOptions.amount - The amount to send
 * 
 */
async function getQuote(quoteRequestOptions) {
  
  // TODO: implement this...
  // There is no auth explicitly required here
  await sleep(1000);
  
  // These are just mock values for now, and are likely to change
  // We will need the condition in here I think...
  console.log("quoteRequestOptions are", quoteRequestOptions)
  return {
    partyName: 'C. Stevens',
    fee: quoteRequestOptions.amount * 0.1 + 1
  }
}

/**
 * @function sendTransfer
 * @description Send the transfer, with the challenge signed by the FIDO
 * @param {*} sendTranferOptions
 * Note: in this example, we save the credentialId locally, but I think it's more canonical for
 * the FIDO server to keep track of this for us.  
 *
 */
async function sendTransfer(credentialId) {
  console.log('sending a transfer')
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
 * @description Gets the necessary things we need from the server. Mocked out for now
 * @todo: Implement fully
 */
async function getCredServerOptions() {
  // TODO: implement properly, these are mock values only.
  // Some of these values will come from the DFSP, others from the PISP, others from the shared FIDO
  const challenge = "challenge:12345"
  const relyingParty = {
    name: "Mojaloop Shared FIDO",
    // important, must be same as webpage.
    id: "localhost",
  }
  const userId = "userid:12345"

  return {
    challenge,
    relyingParty,
    userId,
  }
}


/**
 * @function registerPublicKey
 * @param {PublicKeyCredential} publicKey
 */
async function registerPublicKey(publicKey) {
  //TODO: talk to FIDO server, give them the PublicKeyCredential the browser made for us

  return true;
}


export default {
  getCredServerOptions,
  getQuote,
  mock_loginToPISP,
  registerPublicKey,
  sendTransfer,
  
}