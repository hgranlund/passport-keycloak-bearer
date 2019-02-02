class Token {
  constructor (token) {
    this.token = token
    this.decrypt(token)
  }

  decrypt (token) {
    try {
      const [headerPart, contentPat, signaturePart] = token.split('.')
      this.header = JSON.parse(Buffer.from(headerPart, 'base64').toString())
      this.content = JSON.parse(Buffer.from(contentPat, 'base64').toString())
      this.signature = Buffer.from(signaturePart, 'base64')
      this.signed = `${headerPart}.${contentPat}`
    } catch (error) {
      throw new Error('Token is malformed')
    }
  }

  isExpired () {
    return !(this.content.exp * 1000 > Date.now())
  }
}

module.exports = Token
