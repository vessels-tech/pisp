import FidoHandler from './handler/FidoHandler';
import PispHandler from './handler/PispHandler';
import DFSPHandler from './handler/DFSPHandler';
import MojaloopHandler from './handler/MojaloopHandler';

const routes = [
  // Simple health check
  {
    method: 'GET',
    path: '/health',
    handler: async () => ({ "healthy": true }),
  },
  // Dedicated PISP Endpoints (no passthrough to other systems)
  {
    method: 'POST',
    path: '/pisp/loginOrSignup',
    handler: PispHandler.loginOrSignup,
  },
  //DFSP Passthrough Endpoints
  {
    method: 'POST',
    path: '/dfsp/loginToDfsp',
    handler: DFSPHandler.login,
  },
  {
    method: 'GET',
    path: '/dfsp/accountMetadata',
    handler: DFSPHandler.accountMetadata,
  },
  // FIDO Passthrough Endpoints
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
  //Mojaloop Passthrough Endpoints
  // TODO: Maybe these need to talk via the SDK?
  {
    method: 'POST',
    path: '/ml/lookupAndQuote',
    handler: MojaloopHandler.lookupAndQuote
  },
  {
    method: 'POST',
    path: '/ml/transfer',
    handler: MojaloopHandler.transfer
  },

]



export default routes;