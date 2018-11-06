import { Strategy } from 'passport-strategy';
import KeyCloakCerts from 'get-keycloak-public-key';
import JwtVerification from './jwtVerification';
import {verifyOptions, setDefaults} from './options';

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    super();
    verifyOptions(options);
    this.options = setDefaults(options);
    this.log = this.options.log;
    this.userVerify = verify || this.success;
    
    this.jwtVerification = new JwtVerification(this.options);
    this.keyCloakCerts = new KeyCloakCerts(this.options.host, this.options.realm);
    
    this.log.debug('KeycloakBearerStrategy created');
  }

  failWithLog(message, status) {
    this.log.warn(
      `KeycloakBearerStrategy - Authentication failed due to: ${message}`
    );
    return this.fail(message, status);
  }

  tokenFromReq(req) {
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
          'access_token cannot be passed in both request header and body',
          400
        );
      }
      token = req.body.access_token;
      if (token) {
        this.log.debug(
          'KeycloakBearerStrategy - access_token is received from request body'
        );
      }
    }

    if (req.query && req.query.access_token) {
      if (token) {
        return this.fail('received multiple tokens', 400);
      }
      token = req.query.access_token;
      if (token) {
        this.log.debug(
          'KeycloakBearerStrategy - access_token is received from query'
        );
      }
    }

    if (!token) {
      this.failWithLog('token is not found');
    }

    return token;
  }

  verifyOnline(token) {
    return this.jwtVerification.verify(token);
  }

  handleVerifiedToken(req, verifiedToken, user) {
    if (!this.userVerify) {
      this.log.debug(
        'KeycloakBearerStrategy - Callback was not provided, calling success'
      );
      this.success(null, verifiedToken);
    } else if (this.options.passReqToCallback) {
      this.log.debug('KeycloakBearerStrategy - Passing req back to callback');
      this.userVerify(req, verifiedToken, user, this.verified.bind(this));
    } else {
      this.log.debug(
        'KeycloakBearerStrategy - We did not pass Req back to callback'
      );
      this.userVerify(verifiedToken, user, this.verified.bind(this));
    }
  }

  handleErrorFromOnlineVerification(data) {
    if (data.error) {
      this.failWithLog(
        `keycloak responded with "${data.error} - ${data.error_description}"`
      );
    } else {
      this.failWithLog('unable to verify token');
    }
  }

  verified(err, user, info) {
    if (err) return this.error(err);

    if (!user) {
      let msg = 'error: invalid_token';
      if (info && typeof info === 'string')
        msg += `, error description: ${info}`;
      else if (info) msg += `, error description: ${JSON.stringify(info)}`;
      return this.failWithLog(msg);
    }

    return this.success(user, info);
  }

  authenticate(req) {
    const token = this.tokenFromReq(req);
    if (!token) return;

    this.verifyOnline(token)
      .then(verifiedContext => {
        if (!verifiedContext) {
          this.failWithLog('Unable to verify token');
        } else {
          this.handleVerifiedToken(
            req,
            verifiedContext.token,
            verifiedContext.user
          );
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          this.handleErrorFromOnlineVerification(error.response.data);
        } else {
          this.failWithLog(error);
        }
      });
  }
}
