import Hapi, { ResponseObject } from '@hapi/hapi'


async function getCredServerOptions(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: create a challenge and save it somewhere
  // TODO: should these settings come from FIDO? Or the PISP-server?
  // I think they should come from the FIDO, but there is PISP stuff that needs to be in here.
  const challenge = "challenge:12345"
  const relyingParty = {
    name: "Mojaloop Shared FIDO",
    // important, must be same as webpage.
    id: "localhost",
  }
  // Not sure where this should come from... probably the PISP
  const userId = "userid:12345"

  const defaultOptions = {
    challenge,
    relyingParty,
    userId,
  }


  //TODO: call MojaloopApi.getFIDOOptions

  // const defaultOptions = {}

  return h.response(defaultOptions).code(200)
}

/**
 * @function registerPublicKey
 * @description Register the public key from the user's device with the FIDO server
 *   We also need to s
 *  
 * 
 * @param _ 
 * @param h 
 */
async function registerPublicKey(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO:
  // 1. Save the public key locally
  // 2. Pass onto the fido with MojaloopApi.registerPublicKey



  return h.response({success: true}).code(200)
}

export default {
  getCredServerOptions,
  registerPublicKey,
}