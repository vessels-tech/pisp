import Hapi, { ResponseObject } from '@hapi/hapi'

async function lookupAndQuote(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: save the public key and pass onto fido

  return h.response(undefined).code(201)
}

async function transfer(_: any, h: Hapi.ResponseToolkit): Promise<ResponseObject> {
  // TODO: save the public key and pass onto fido

  return h.response(undefined).code(201)
}

export default {
  lookupAndQuote,
  transfer,

}