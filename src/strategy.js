import { Strategy } from 'passport-strategy';
import JwtVerification from './jwtVerification';
import { verifyOptions, setDefaults } from './options';

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    super();
    verifyOptions(options);
    this.options = setDefaults(options);
    this.log = this.options.log;
    this.userVerify = verify || this.success;

    this.name = this.options.name;
    this.jwtVerification = new JwtVerification(this.options);

    this.log.debug('KeycloakBearerStrategy created');
  }

  failWithLog(message, status) {
    if (message instanceof Error) {
      this.log.warn(
        `KeycloakBearerStrategy - Authentication failed due to: ${message.message}`,
      );
      return this.fail(message.message, status || 400);
    }
    this.log.warn(
      `KeycloakBearerStrategy - Authentication failed due to: ${message}`,
    );
    return this.fail(message, status);
  }

  tokenFromReq(req) {
    let token;

    if (req.headers && req.headers.authorization) {
      const authComponents = req.headers.authorization.split(' ');
      if (
        authComponents.length === 2
        && authComponents[0].toLowerCase() === 'bearer'
      ) {
        [, token] = authComponents;
        if (token !== '') {
          this.log.debug(
            'KeycloakBearerStrategy - access_token is received from request header',
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
          400,
        );
      }
      token = req.body.access_token;
      if (token) {
        this.log.debug(
          'KeycloakBearerStrategy - access_token is received from request body',
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
          'KeycloakBearerStrategy - access_token is received from query',
        );
      }
    }

    if (!token) {
      this.failWithLog('token is not found');
    }

    return token;
  }

  handleVerifiedToken(req, verifiedToken) {
    if (!this.userVerify) {
      this.log.debug(
        'KeycloakBearerStrategy - Callback was not provided, calling success',
      );
      this.success(null, verifiedToken);
    } else if (this.options.passReqToCallback) {
      this.log.debug('KeycloakBearerStrategy - Passing req back to callback');
      this.userVerify(req, verifiedToken, this.verified.bind(this));
    } else {
      this.log.debug(
        'KeycloakBearerStrategy - We did not pass Req back to callback',
      );
      this.userVerify(verifiedToken, this.verified.bind(this));
    }
  }

  handleErrorFromOnlineVerification(data) {
    if (data.error) {
      this.failWithLog(
        `error="${data.error}", error_description="${data.error_description}"`,
      );
    } else {
      this.failWithLog('unable to verify token');
    }
  }

  verified(err, user, info) {
    if (err) return this.error(err);
    if (!user) {
      let msg = 'error: ';
      if (!info) {
        msg += 'No user was provided in callback';
      } else if (info && typeof info === 'string') {
        msg += info;
      }
      return this.failWithLog(msg);
    }

    return this.success(user, info);
  }

  authenticate(req) {
    const token = this.tokenFromReq(req);
    if (!token) return;

    this.jwtVerification.verify(token)
      .then((verifiedToken) => {
        if (!verifiedToken) {
          this.failWithLog('Unable to verify token');
        } else {
          this.handleVerifiedToken(
            req,
            verifiedToken,
          );
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          this.handleErrorFromOnlineVerification(error.response.data);
        } else {
          this.failWithLog(error);
        }
      });
  }
}
