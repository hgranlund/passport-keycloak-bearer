import { Strategy } from 'passport-strategy';
import keycloak from 'keycloak-backend';
import getLogger from './logging';

const log = getLogger('Keycloak: Bearer strategy');

const verifyOptions = options => {
  if (!options || typeof options !== 'object')
    throw new Error('KeycloakBearerStrategy: options is required');
  if (!options.realm)
    throw new Error('KeycloakBearerStrategy: realm is required');
  if (!options.clientId || options.clientID === '')
    throw new Error('KeycloakBearerStrategy: clientId cannot be empty');
  if (!options.host || options.host === '')
    throw new Error('KeycloakBearerStrategy: host cannot be empty');
  if (options.customLogger) {
    if (typeof options.customLogger.error !== 'function')
      throw new Error(
        'KeycloakBearerStrategy: customLogger must have a error function'
      );
    if (typeof options.customLogger.warn !== 'function')
      throw new Error(
        'KeycloakBearerStrategy: customLogger must have a warn function'
      );
    if (typeof options.customLogger.info !== 'function')
      throw new Error(
        'KeycloakBearerStrategy: customLogger must have a info function'
      );
    if (typeof options.customLogger.debug !== 'function')
      throw new Error(
        'KeycloakBearerStrategy: customLogger must have a debug function'
      );
  }
};

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    super();
    verifyOptions(options);

    this.log = log;
    this.log.levels('console', options.loggingLevel || 'warn');
    this.log = options.customLogger ? options.customLogger : log;

    this.userVerify = verify || this.success;
    this.options = options;
    this.keycloak = this.createKeycloak();
    this.name = 'keycloak';
    this.log.debug('KeycloakBearerStrategy created');
  }

  createKeycloak() {
    return keycloak({
      realm: this.options.realm,
      'auth-server-url': this.options.host,
      client_id: this.options.clientId
    });
  }

  failWithLog(message) {
    this.log.warn(
      `KeycloakBearerStrategy - Authentication failed due to: ${message}`
    );
    return this.fail(message);
  }

  tokenFromReq(req) {
    if (req.query && req.query.access_token) {
      return this.failWithLog(
        'access_token should be passed in request header or body. query is unsupported'
      );
    }

    let token;
    if (req.headers && req.headers.authorization) {
      const authComponents = req.headers.authorization.split(' ');
      if (
        authComponents.length === 2 &&
        authComponents[0].toLowerCase() === 'bearer'
      ) {
        [, token] = authComponents;
        if (token !== '') {
          this.log.debug(
            'KeycloakBearerStrategy - access_token is received from request header'
          );
        } else {
          this.failWithLog('missing access_token in the header');
        }
      }
    }

    if (req.body && req.body.access_token) {
      if (token) {
        return this.failWithLog(
          'access_token cannot be passed in both request header and body'
        );
      }
      token = req.body.access_token;
      if (token) {
        this.log.debug(
          'KeycloakBearerStrategy - access_token is received from request body'
        );
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
      this.log.debug(
        'KeycloakBearerStrategy - Callback was not provided, calling success'
      );
      this.success(null, verifiedToken);
    } else if (this.options.passReqToCallback) {
      this.log.debug('KeycloakBearerStrategy - Passing req back to callback');
      this.userVerify(req, verifiedToken.content, this.success);
    } else {
      this.log.debug(
        'KeycloakBearerStrategy - We did not pass Req back to callback'
      );
      this.userVerify(verifiedToken.content, this.success);
    }
  }

  authenticate(req) {
    const token = this.tokenFromReq(req);
    if (!token) return;

    this.verifyOnline(token)
      .then(verifiedToken => {
        if (!verifiedToken) {
          this.failWithLog('Unable to verify token');
        } else {
          this.handleVerifiedToken(req, verifiedToken);
        }
      })
      .catch(error => {
        if (error.response) {
          this.failWithLog(`Auth server gave us a  "${error.message}"`);
        } else {
          this.failWithLog(error);
        }
      });
  }
}
