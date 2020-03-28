import Hapi, { ResponseObject } from '@hapi/hapi'


async function getCredServerOptions(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: create a challenge and save it somewhere
  // TODO: should these settings come from FIDO? Or the PISP-server?
  const challenge = "challenge:12345"
  const relyingParty = {
    name: "Mojaloop Shared FIDO",
    // important, must be same as webpage.
    id: "localhost",
  }
  // Not sure where this should come from...
  const userId = "userid:12345"

  const defaultOptions = {
    challenge,
    relyingParty,
    userId,
  }

  return h.response(defaultOptions).code(200)
}

async function registerPublicKey(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: save the public key and pass onto fido

  return h.response(undefined).code(201)
}

export default {
  getCredServerOptions,
  registerPublicKey,
}