import FidoHandler from './handler/FidoHandler';
import PispHandler from './handler/PispHandler';
import MojaloopHandler from './handler/MojaloopHandler';

const routes = [
  // Simple health check
  {
    method: 'GET',
    path: '/health',
    handler: async () => ({ "healthy": true }),
  },

  /* --- PISP Endpoints (outside the scope of the ML API) --- */

  {
    method: 'POST',
    path: '/pisp/loginOrSignup',
    handler: PispHandler.loginOrSignup,
  },
  {
    method: 'GET',
    path: '/pisp/loginPage/{dfspId}',
    handler: PispHandler.getDFSPLoginPage,
  },
  {
    method: 'GET',
    path: '/pisp/accountMetadata',
    handler: PispHandler.getAccountMetadata,
  },
  {
    method: 'GET',
    path: '/pisp/quoteAndPendingAuth',
    handler: PispHandler.getQuoteAndPendingAuth,
  },
  {
    method: 'PUT',
    path: '/pisp/transfer/{transferId}',
    handler: PispHandler.approveTransfer,
  },

  /* --- FIDO Passthrough Endpoints --- */

  // Note: these will also likely need to be async apis, but for 
  // the sake of this demo, the central-fido won't be proxied by
  // the switch, but accessible directly on localhost
  {
    method: 'GET',
    path: '/fido/options',
    handler: FidoHandler.getCredServerOptions
  },
  {
    method: 'POST',
    path: '/fido/register',
    handler: FidoHandler.registerPublicKey
  },

  /* --- Mojaloop Callbacks --- */

  // TODO: add the callbacks required by the sdk-scheme-adapter
  // Note: We are adding a lot of complexity to the PISP in handling callbacks 
  // that could be abstracted away by the SDK Scheme adapter in the future.
  {
    method: 'POST',
    path: '/ml/onDFSPLoginPage',
    handler: MojaloopHandler.onDFSPLoginPage,
  },
  {
    method: 'POST',
    path: '/ml/onUserLoggedIn',
    handler: MojaloopHandler.onUserLoggedIn,
  },
  {
    method: 'POST',
    path: '/ml/onQuoteResponse',
    handler: MojaloopHandler.onQuoteResponse,
  },
  {
    // TODO: this might already be dictated by the sdk scheme adapter
    method: 'POST',
    path: '/ml/onAuthRequest',
    handler: MojaloopHandler.onAuthRequest,
  },
  {
    method: 'POST',
    path: '/ml/onRequestReponse',
    handler: MojaloopHandler.onRequestReponse,
  },
]

export default routes;