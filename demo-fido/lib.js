/* Lib file for API and FIDO interactions */


/* FIDO */

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
}

function getAssertion() {
  console.log("getting assertion")
}


/* Mojaloop API */

function getQuote() {
  console.log('getting a quote')
}

function sendTransfer() {
  console.log('sending a transfer')
}


export default {
  createCredential,
  getAssertion,
  getQuote,
  sendTransfer,
}