const request = require('request-promise-native')
const rsaPublicKeyPem = require('./rsaPemDecoder')
const Token = require('./token')

class OIDCMatadata {
  constructor (host, realm, log) {
    this.log = log
    this.dicoverUrl = `${host}/realms/${realm}/.well-known/openid-configuration`
    this.getPemKeys().catch(err => {
      this.log.warn(err.message)
    })
  }

  getKeysFromResponse (body) {
    if (!body.keys || body.keys.length === 0) {
      throw new Error('We got no AAD signing Keys')
    }
    return body.keys.map(key => ({
      ...key,
      pemKey: rsaPublicKeyPem(key.n, key.e)
    }))
  }

  async getPemKeys () {
    if (Array.isArray(this.keys) && this.keys.length > 0) {
      return this.keys
    }
    try {
      const discoverUrls = await request.get(this.dicoverUrl, { json: true })
      const response = await request.get(discoverUrls.jwks_uri, { json: true })
      this.keys = this.getKeysFromResponse(response)
      return this.keys
    } catch (error) {
      const errorMsg = `Cannot get AAD signing Keys from url ${
        this.jwksUrl
      }. We got a  ${error.statusCode}: ${error.message} `
      throw new Error(errorMsg)
    }
  }

  async pemKeyFromToken (rawToken, done) {
    const token = new Token(rawToken)
    if (token.isExpired()) {
      this.log.info('The access token has expired')
    }
    this.log.debug(`Got token with kid: ${token.header.kid}`)

    const keys = await this.getPemKeys()
    const keyforToken = keys.find(key => key.kid === token.header.kid)
    if (!keyforToken) throw Error(`No key matching kid ${token.header.kid}`)

    return keyforToken.pemKey
  }
}

module.exports = OIDCMatadata
