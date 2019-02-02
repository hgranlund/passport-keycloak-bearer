// http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
const prepadSigned = hexStr => {
  const msb = hexStr[0]
  if (msb < '0' || msb > '7') {
    return `00${hexStr}`
  }
  return hexStr
}

const toHex = number => {
  const nstr = number.toString(16)
  if (nstr.length % 2) return `0${nstr}`
  return nstr
}

// encode ASN.1 DER length field
// if <=127, short form
// if >=128, long form
const encodeLengthHex = n => {
  if (n <= 127) return toHex(n)

  const nHex = toHex(n)
  const lengthOfLengthByte = 128 + nHex.length / 2 // 0x80+numbytes
  return toHex(lengthOfLengthByte) + nHex
}

const rsaPublicKeyPem = (modulusB64, exponentB64) => {
  const modulus = Buffer.from(modulusB64, 'base64')
  const exponent = Buffer.from(exponentB64, 'base64')

  let modulusHex = modulus.toString('hex')
  let exponentHex = exponent.toString('hex')

  modulusHex = prepadSigned(modulusHex)
  exponentHex = prepadSigned(exponentHex)

  const modlen = modulusHex.length / 2
  const explen = exponentHex.length / 2

  const encodedModlen = encodeLengthHex(modlen)
  const encodedExplen = encodeLengthHex(explen)
  const encodedPubkey = `30${encodeLengthHex(
    modlen + explen + encodedModlen.length / 2 + encodedExplen.length / 2 + 2
  )}02${encodedModlen}${modulusHex}02${encodedExplen}${exponentHex}`

  const derB64 = Buffer.from(encodedPubkey, 'hex').toString('base64')

  const pem = `-----BEGIN RSA PUBLIC KEY-----\n${derB64
    .match(/.{1,64}/g)
    .join('\n')}\n-----END RSA PUBLIC KEY-----\n`

  return pem
}

module.exports = rsaPublicKeyPem
