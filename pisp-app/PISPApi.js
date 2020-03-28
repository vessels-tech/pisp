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
 * 
 *   pisp-app ---> pisp-server
 * 
 * @param {*} options 
 */
async function mock_loginToPISP(options) {
  console.log("mock logging in to pisp with options", options)
  await sleep(1000);

  return {
    ...options
  }
}

/**
 * @function mock_loginToDFSP
 * @description Logs into the DFSP with the user's supplied credentials.
 *   This will return some sort of token the PISP can use to talk to the 
 *   DFSP on the User's behalf
 * 
 *   pisp-app -> pisp-server -> ml-switch -> DFSP
 * 
 * @param {*} options 
 */
async function mock_loginToDFSP(options) {
  await sleep(1000);

  return {
    ...options
  }
}

/**
 * @function mock_getDFSPAccountMetadata
 * @description Using the token supplied from `mock_loginToDFSP`, ask
 *   the DFSP for a list of accounts and balances on behalf of the user
 * 
 *   pisp-app -> pisp-server -> ml-switch -> DFSP
 * 
 * @param {*} options 
 */
async function mock_getDFSPAccountMetadata(token) {
  await sleep(1000);

  // TODO: implement full demo account metadata
  const mockAccounts = [
    {
      name: 'xxxx9876',
      nickname: 'Savings',
      balance: '$1,002.24'
    },
    {
      name: 'xxxx1234',
      nickname: 'Spendings',
      balance: '$52.13'
    },
  ]

  return mockAccounts
}



/* --- Mojaloop Functions --- */

/**
 * @function getQuote
 * @description Get a quote from the PISP Server
 * 
 *
 *   pisp-app -> pisp-server -> ml-switch -> DFSP ?
 *
 * 
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
  return {
    partyName: 'C. Stevens',
    fee: quoteRequestOptions.amount * 0.1 + 1
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
 *
 *   pisp-app -> pisp-server -> ml-switch -> central-fido
 *
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



export default {
  getCredServerOptions,
  getQuote,
  mock_loginToPISP,
  mock_loginToDFSP,
  mock_getDFSPAccountMetadata,
  registerPublicKey,
  sendTransfer,
  
}