import { Strategy } from 'passport-strategy';
import keycloak from 'keycloak-backend';

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    super();
    if (typeof options === 'function') {
      verify = options;
      options = {};
    }
    if (!verify) { throw new TypeError('KeycloakBearerStrategy requires a verify callback'); }
  
    this.userVerify = verify;
    this.options = options;
    this.keycloak = this.createKeycloak();
    this.name = 'keycloak';
  }

  createKeycloak() {
    return keycloak({
      realm: this.options.realm,
      'auth-server-url': this.options.host,
      client_id: this.options.clientID
    });
  }

  failWithLog(message) {
    // console.log(`Authentication failed due to: ${message}`);
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
          // console.log('access_token is received from request header');
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
        // console.log('access_token is received from request body');
      }
    }

    if (!token) {
      return this.failWithLog('token is not found');
    }
    return token;
  }

  verifyOnline(token) {
    return this.keycloak.jwt.verify(token);
  }

  authenticate(req) {
    const token = this.tokenFromReq(req);
    this.verifyOnline(token)
      .then((verifiedToken) => {
        if (!verifiedToken) {
          this.failWithLog('Unable to verify token');
        } else {
          this.userVerify(verifiedToken.content, this.success);
        }
      }).catch((error) => {
        if (error.response) {
          this.failWithLog(`Auth server returned: ${error.message}`);
        } else {
          this.failWithLog(error);
        }
      });
  }
}
