
import type { StrategyOptions, VerifyCallback, VerifyCallbackWithRequest } from 'passport-jwt'
import { Strategy } from 'passport-jwt'

declare class KeycloakBearerStrategy extends Strategy {
  constructor(options: KeycloakBearerStrategy.Options, verify?: VerifyCallback)
  constructor(opt: KeycloakBearerStrategy.Options & { passReqToCallback: false }, verify: VerifyCallback);
  constructor(opt: KeycloakBearerStrategy.Options & { passReqToCallback: true }, verify: VerifyCallbackWithRequest);
}
declare namespace KeycloakBearerStrategy{
  interface Options {
  /** Keycloak auth url. For instance: https://keycloak.dev.org/auth. */
  url: string
  /** Your realm. */
  realm?: string
  /**
   * Whether you want to use req as the first parameter in the verify callback.
   *
   * See section 5.1.1.3 for more details.
   * @default false
   */
  passReqToCallback?: StrategyOptions['passReqToCallback']
  /**
   * Logging level
   * @default 'warn'
   */
  loggingLevel?: 'debug' | 'info' | 'warn' | 'error'
  /** Custom logging instance. */
  customLogger?: Record<'debug' | 'info' | 'warn' | 'error', (...a: any[]) => any>
  /** If defined the token issuer (iss) will be verified against this value. */
  issuer?: StrategyOptions['issuer']
  /** If defined, the token audience (aud) will be verified against this value. */
  audience?: StrategyOptions['audience']
  /**
   * List of strings with the names of the allowed algorithms.
   * @example ["HS256", "HS384"].
   * @default ["HS256"]
   */
  algorithms?: StrategyOptions['algorithms']
  /** If true do not validate the expiration of the token. */
  ignoreExpiration?: StrategyOptions['ignoreExpiration']
  /** This value can be set according passport-jwt if this options is not used, passport-keycloak-bearer will obtain jwt from http header Auth as a Bearer token. */
  jwtFromRequest?: StrategyOptions['jwtFromRequest']
  /** passport-keycloak-bearer is verifying the token using jsonwebtoken. Pass here an options object for any other option you can pass the jsonwebtoken verifier. (i.e maxAge) */
  jsonWebTokenOptions?: StrategyOptions['jsonWebTokenOptions']

  // secretOrKey: removed
  // secretOrKeyProvider: removed
  }
}

export = KeycloakBearerStrategy
