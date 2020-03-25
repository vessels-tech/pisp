import PISPApi from './PISPApi.js'


async function createCredential(options) {
  const serverOptions = await PISPApi.getCredServerOptions()
  console.log("helo", serverOptions)
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

  //Send to the FIDO Server to save for us
  const registerPublicKeyResult = await PISPApi.registerPublicKey(credential)

  return credential
}

/**
 * @function getAssertion
 * @description Sign the quote with the private key to create an assertion.
 * @param {*} options 
 */
async function getAssertion(options) {
  const { challengeString, credentialId } = options;

  const publicKeyCredentialRequestOptions = {
    challenge: Uint8Array.from(challengeString, c => c.charCodeAt(0)),
    allowCredentials: [{
      id: Uint8Array.from(credentialId, c => c.charCodeAt(0)),
      type: 'public-key',
      transports: ['usb', 'ble', 'nfc'],
    }],
    timeout: 60000,
  }

  const assertion = await navigator.credentials.get({
    publicKey: publicKeyCredentialRequestOptions
  });

  return assertion;
}

export default {
  createCredential,
  getAssertion,
}