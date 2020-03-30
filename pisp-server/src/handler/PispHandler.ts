import Hapi, { ResponseObject } from '@hapi/hapi'

/**
 * @function mock_loginToPISP
 * @description Logs into the PISP. This is a mock function that assumes a user
 *   already exists. Outside the scope of this demo (and the Mojaloop API)
 *
 *   pisp-app ---> pisp-server
 *
 * @param {*} options
 */
async function loginOrSignup(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  //Sign in to the PISP app, outside the scope of Mojaloop API

  // TODO: implement 

  return h.response(undefined).code(201)
}

/**
 * @function getDFSPLoginPage
 * @description Gets the login page for the DFSP. Requires onDFSPLoginPage to have been called first.
 *
 *   pisp-app ---> pisp-server
 *
 * @param {*} options
 */
async function getDFSPLoginPage(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // Call the async function, and wait until the onDFSPLoginPage callback is called
  // return the response from onDFSPLoginPage

  // TODO: implement

  return h.response(undefined).code(201)
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
async function getAccountMetadata(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: replace with MojaloopApi call
  // 1. Check if we have the token
  // 2. If not, fail with some error code
  // 3. If we do have the token, call MojallopApi.getParty and pass on the token
  // 4. Return the account metadata from getParty
  //

  // await sleep(1);

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

  return h.response(mockAccounts).code(200)
}


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
async function getQuoteAndPendingAuth(quoteRequestOptions: any) {
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
 * @function approveTransfer
 * @description Approve the transfer, with the challenge signed by the FIDO
 *
 *   pisp-server -> ml-switch -> DFSP
 *
 * 
 * @param {*} sendTranferOptions
 * Note: in this example, we save the credentialId locally, but I think it's more canonical for
 * the FIDO server to keep track of this for us.  
 *
 */
async function approveTransfer(credentialId: any) {
  // TODO:
  // 1. lookup the pending quote and auth
  // 2. If it doesn't exist, error
  // 3. if it does exist, then call MojaloopApi.approveQuote? Not sure about this...

  // await sleep(1200)

  // const assertionOptions = {
  //   challengeString: 'challenge:1234', //this should be the confirmation from the quote?
  //   // credentialId: 'credential:1234', //this should be saved during the registration step
  //   credentialId,
  // }

  // const assertion = await FidoAPI.getAssertion(assertionOptions)

  //TODO: send off to the PISP to make the actual transaction
  // PISP must forward onto switch and FIDO server to verify the tx is valid

  return true;
}


export default {
  approveTransfer,
  getAccountMetadata,
  getDFSPLoginPage,
  getQuoteAndPendingAuth,
  loginOrSignup,
}