
import type { StrategyOptions, VerifyCallback } from 'passport-jwt'
import { Strategy } from 'passport-jwt'

class KeycloakBearerStrategy extends Strategy {
  constructor(options: KeycloakBearerStrategy.Options, verify?: VerifyCallback)
}
namespace KeycloakBearerStrategy{
  interface Options extends StrategyOptions {
	realm: string
	url: string
	customLogger?: Record<'error' | 'warn' | 'info' | 'debug', (...a: any) => any>
  }
}

export = KeycloakBearerStrategy