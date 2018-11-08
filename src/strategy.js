import { Strategy, ExtractJwt } from 'passport-jwt';
import { verifyOptions, setDefaults } from './options';
import pemKeyProvider from './pemKeyProvider';

const defaultVerify = (verifidToken, done) => {
  if (verifidToken) {
    return done(null, verifidToken);
  }
  return done(null, false);
};

export default class KeycloakBearerStrategy extends Strategy {
  constructor(options, verify) {
    verifyOptions(options);
    const opts = setDefaults(options);
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKeyProvider = pemKeyProvider(opts.host, opts.realm);
    super(opts, verify || defaultVerify);
    this.log = opts.log;
    this.name = opts.name;
    this.superFail = this.fail;
    this.superAuthenticate = this.authenticate;
    this.log.debug('KeycloakBearerStrategy created');
  }
}
