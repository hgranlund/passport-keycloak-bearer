
import type { StrategyOptions, VerifyCallback } from 'passport-jwt'
import { Strategy } from 'passport-jwt'

class KeycloakBearerStrategy extends Strategy {
  constructor(options: KeycloakBearerStrategy.Options, verify?: VerifyCallback)
}
namespace KeycloakBearerStrategy{
  interface Options extends Omit<StrategyOptions, 'jwtFromRequest' | 'secretOrKey' | 'secretOrKeyProvider'> {
	realm: string
	url: string
	customLogger?: Record<'error' | 'warn' | 'info' | 'debug', (...a: any) => any>
	jwtFromRequest?: StrategyOptions['jwtFromRequest']
  }
}

export = KeycloakBearerStrategy