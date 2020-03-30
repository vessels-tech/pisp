import request from 'request-promise-native'
import Config from './Config'



/* New Calls */

/*
  These are the new apis and fido related apis that mojaloop will
  need to support.

  For now, they will be mocked or fido calls will be sent directly over
  localhost than implemented in the testing toolkit (as with other calls)

  TODO: implement:
  - [ ] getDFSPLoginForm - Gets the login form for the DFSP
  - [ ] getDFSPAccountBalancesForLinking - given a short lived token, get the accounts and metadata for the user. This possibly will use the existing GET /parties endpoint...

  - [ ] getFIDOOptions - gets the required options for registering a new key with the central-fido
  - [ ] registerPublicKey - registers the public key from a signed challenge with the central-fido


*/


/* --- Existing Mojaloop Calls --- */

/**
 * @function createAccount
 * @description Registers the account with the ALS. The PISP shouldn't 
 *   have to call this because the account should already exist, so we 
 *   might not end up needing it
 */

async function createAccount(opts: any): Promise<any> {

  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers`,
    method: 'POST',
    json: true,
    simple: true,
    headers: buildHeaders(),
    body: {
      accountsRequest: [
        {
          // hardcoded for now
          idType: 'MSISDN',
          idValue: opts.idValue,
          currency: Config.CURRENCY,
        }
      ]
    }
  }

  await request(options)
  return 'something'
}

/**
 * @function getParty
 * @description Gets the party information. Used by the PISP to double-check the sending party's details
 */
async function getParty(opts: any): Promise<any> {
  // TODO: this isn't supported by the scheme adapter, since getParty is contained
  // within the transferEndpoint.

  // We will either need to implement this in the Scheme Adapter, or hack the
  // startTransfer with `AUTO_ACCEPT_PARTIES` to false...
  throw new Error("Not Implemented")
}



/**
 * @function startTransfer
 * @description Starts the tranfer to the given DFSP.
 * 
 * TODO: figure out `AUTO_ACCEPT_PARTIES` implications for the PISP case. Perhaps we have
 * this turned off, so we can treat the `startTransfer` as essentially the Party Lookup 
 * step
 * 
 * Since `AUTO_ACCEPT_QUOTES` is OFF, this function will only kick off the party
 * lookup and quote process. The quote will need to be approved by the end user.
 * For that, see `approveTransfer()`
 * 
 */
async function startTransfer(opts: any): Promise<any> {
  // TODO: validate and figure out the options here.
  const transfer = opts;

  // TODO: will this endpoint still work for the PISP case? 
  // Does anything need to change from either the Scheme Adapter's or Switch's
  // perspective to make this work?
  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers`,
    method: 'POST',
    json: true,
    simple: true,
    headers: buildHeaders(),
    body: {
      ...transfer,
      from: {
        idType: transfer.fromIdType,
        idValue: transfer.fromIdValue,
      },
      to: {
        idType: transfer.toIdType,
        idValue: transfer.toIdValue,
      },
      amountType: 'SEND',
      currency: Config.CURRENCY,
      transactionType: 'TRANSFER',
      homeTransactionId: '123ABC'
    }
  }

  //TODO: this only fails on timeout if the party can't be found
  //I think that's an issue in the scheme adapter, not this implementation
  await request(options)

  return 'something'
}

/**
 * @function approveParty
 * @description Approves the a party and continues the transfer to quoting step
 *
 */
async function approveParty(transferId: string, opts: any): Promise<any> {
  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers/${transferId}`,
    method: 'PUT',
    json: true, 
    simple: true,
    body: {
      acceptParty: true
    }
  }

  await request(options)

  return 'something';
}

/**
 * @function approveQuote
 * @description Approves the a quote and continues the transfer
 * 
 * //TODO: According to our docs, the PISP should be calling transactionRequests... so maybe this
 * should be calling the request to pay use case for the sdk-scheme-adapter
 *
 */
async function approveQuote(transferId: string, opts: any): Promise<any> {
  const options = {
    url: `http://${Config.SCHEME_ADAPTER_ENDPOINT}/transfers/${transferId}`,
    method: 'PUT',
    json: true, 
    simple: true,
    body: {
      acceptQuote: true
    }
  }

  await request(options)

  return 'something';
}

/**
 * Utility method to build a set of headers required by the SDK outbound API
 *
 * @returns {object} - Object containing key/value pairs of HTTP headers
 */
const buildHeaders = () => {
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Date': new Date().toUTCString(),
    'fspiop-source': Config.DFSP_ID,
  };

  return headers;
};


export default {
  createAccount,
  getParty,
  startTransfer,
  approveParty,
  approveQuote,

}