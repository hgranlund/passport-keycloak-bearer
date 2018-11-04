import { Strategy } from 'passport-strategy';
import keycloak from 'keycloak-backend';
import getLogger from './logging';

const log = getLogger('Keycloak: Bearer strategy')

const verifyOptions = (options) => {
  if (!options || typeof options !== 'object')
    throw new Error('options is required');
  if (!options.realm)
    throw new Error('realm is required');
  if (!options.clientId || options.clientID === '')
    throw new Error('clientId cannot be empty');
  if (!options.host || options.host === '')
    throw new Error('host cannot be empty');
}

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    super();
    verifyOptions(options);

    log.levels('console', options.loggingLevel || 'warn');
    this.userVerify = verify || this.success;
    this.options = options;
    this.keycloak = this.createKeycloak();
    this.name = 'keycloak';
    log.debug('Strategy created');
  }

  createKeycloak() {
    return keycloak({
      realm: this.options.realm,
      'auth-server-url': this.options.host,
      client_id: this.options.clientId
    });
  }

  failWithLog(message) {
    log.warn(`Authentication failed due to: ${message}`);
    return this.fail(message);
  }

  tokenFromReq(req) {
    if (req.query && req.query.access_token) {
      return this.failWithLog('access_token should be passed in request header or body. query is unsupported');
    }

    let token;
    if (req.headers && req.headers.authorization) {
      const authComponents = req.headers.authorization.split(' ');
      if (authComponents.length === 2 && authComponents[0].toLowerCase() === 'bearer') {
        [, token] = authComponents;
        if (token !== '') {
          log.debug('access_token is received from request header');
        } else {
          this.failWithLog('missing access_token in the header');
        }
      }
    }

    if (req.body && req.body.access_token) {
      if (token) {
        return this.failWithLog('access_token cannot be passed in both request header and body');
      }
      token = req.body.access_token;
      if (token) {
        log.debug('access_token is received from request body');
      }
    }
    if (!token) {
      this.failWithLog('token is not found');
    }

    return token;
  }

  verifyOnline(token) {
    return this.keycloak.jwt.verify(token);
  }

  handleVerifiedToken(req, verifiedToken) {
    if (!this.userVerify) {
      log.debug('Callback was not provided, calling success');
      this.success(null, verifiedToken);
    } else if (this.options.passReqToCallback) {
      this.userVerify(req, verifiedToken.content, this.success);
    } else {
      log.debug('We did not pass Req back to Callback');
      this.userVerify(verifiedToken.content, this.success);
    }
  }

  authenticate(req) {
    const token = this.tokenFromReq(req);
    if (token) {
      this.verifyOnline(token)
        .then((verifiedToken) => {
          if (!verifiedToken) {
            this.failWithLog('Unable to verify token');
          } else {
            this.handleVerifiedToken(req, verifiedToken);
          }
        }).catch((error) => {
          if (error.response) {
            this.failWithLog(`Auth server gave us a: ${error.message}`);
          } else {
            this.failWithLog(error);
          }
        });
    }
  }
}
