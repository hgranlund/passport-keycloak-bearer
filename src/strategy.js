import { Strategy, ExtractJwt } from 'passport-jwt';
import { verifyOptions, setDefaults } from './options';
import OIDCManager from './oidcMatadata';

const defaultVerify = (jwtPayload, done) => {
  if (jwtPayload) {
    return done(null, jwtPayload);
  }
  return done(null, false);
};

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    verifyOptions(options);
    const opts = setDefaults(options);
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    const oidcManager = new OIDCManager(opts.host, opts.realm, opts.log);
    opts.secretOrKeyProvider = (req, token, done) => {
      oidcManager.pemKeyFromToken(token, done);
    };
    super(opts, verify || defaultVerify);
    this.name = opts.name;
    opts.log.debug('Strategy created');
  }
}
