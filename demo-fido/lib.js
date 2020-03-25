import { sleep } from './util.js'

/* Lib file for API and FIDO interactions */


/* PISP/Mojaloop API */

/**
 * @function getQuote
 * @description Get a quote from the PISP Server
 * @param {*} quoteRequestOptions
 * @param {string} quoteRequestOptions.msidn - The party to send to
 * @param {string} quoteRequestOptions.amount - The amount to send
 * 
 */
async function getQuote(quoteRequestOptions) {
  //TODO: implement this...
  await sleep(1000);

  // These are just mock values for now, and are likely to change
  // We will need the condition in here I think...
  return {
    partyName: 'C. Stevens',
    fee: quoteRequestOptions.amount * 0.1 + 1
  }
}

function sendTransfer() {
  console.log('sending a transfer')
}


/* FIDO Server API*/

/**
 * @function getCredServerOptions
 * @description Gets the necessary things we need from the server. Mocked out for now
 * @todo: Implement fully
 */
async function getCredServerOptions() {
  // TODO: implement properly, these are mock values only
  const challenge = "challenge:12345"
  const relyingParty = {
    name: "Mojaloop Shared FIDO",
    id: "localhost",
  }
  const userId = "userid:12345"

  return {
    challenge,
    relyingParty,
    userId, //I think this needs to c
  }
}


/**
 * @function registerPublicKey
 * @param {PublicKeyCredential} publicKey
 */
async function registerPublicKey(publicKey) {
  //TODO: talk to server, give them the PublicKeyCredential the browser made for us


  return true;
}

/* FIDO Functions */

async function createCredential(options) {
  console.log("creating credential!")

  const serverOptions = await getCredServerOptions()
  const { name, displayName } = options
  const { challenge, relyingParty, userId } = serverOptions;

  const publicKeyCredentialCreationOptions = {
    challenge: Uint8Array.from(challenge, c => c.charCodeAt(0)),
    rp: {
      ...relyingParty,
    },
    user: {
      id: Uint8Array.from(userId, c => c.charCodeAt(0)),
      name,
      displayName,
    },
    pubKeyCredParams: [{ alg: -7, type: "public-key" }],
    authenticatorSelection: {
      authenticatorAttachment: "cross-platform",
    },
    timeout: 60000,
    // I think this is ok for now. Also not sure whether the server or client determines this.
    attestation: "none"

  };

  const credential = await navigator.credentials.create({
    publicKey: publicKeyCredentialCreationOptions
  });

  console.log("created Credential", credential)

  //Send to the FIDO Server
  const registerPublicKeyResult = await registerPublicKey(credential)

}

function getAssertion() {
  console.log("getting assertion")
}



export default {
  createCredential,
  getAssertion,
  getQuote,
  sendTransfer,
}