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

  // TODO: call POST /pisp/loginOrSignup

  return {
    ...options
  }
}

/**
 * @function getDFSPLoginPage
 * @param {*} options 
 */
async function getDFSPLoginPage() {

  // TODO: call GET /pisp/loginPage/{dfspId}

}



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

  // TODO: call GET /pisp/accountMetadata, poll while waiting for onUserLoggedIn
  
}


/**
 * @function getQuoteAndPendingAuth
 * @description Get a saved quote and pending authorization object from the PISP Server. 
 *
 *   pisp-app -> pisp-server
 *
 * 
 * @param {*} quoteRequestOptions
 * @param {string} quoteRequestOptions.id - The transfer id
 * 
 */
async function getQuoteAndPendingAuth(quoteRequestOptions) {
  // TODO: call GET /pisp/quoteAndPendingAuth
}


/**
 * @function approveTransfer
 * @description Approve the transfer, with the challenge signed by the FIDO
 *
 *   pisp-app -> pisp-server -> ml-switch -> DFSP
 *
 * 
 * @param {*} sendTranferOptions
 * Note: in this example, we save the credentialId locally, but I think it's more canonical for
 * the FIDO server to keep track of this for us.  
 *
 */
async function approveTransfer(credentialId) {
  //TODO: call PUT /pisp/transfer/{transferId}

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
  //TODO: call POST /fido/register


  return true;
}




export default {
  approveTransfer,
  getCredServerOptions,
  getDFSPAccountMetadata,
  mock_loginToPISP,
  registerPublicKey,
}