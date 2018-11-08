import request from 'request';
import rsaPublicKeyPem from './rsaPemDecoder';

let cachedPemKey;

const getPemKey = jwksUrl => new Promise((resolve, reject) => {
  if (cachedPemKey) {
    return resolve(cachedPemKey);
  }

  return request.get(jwksUrl, { json: true }, (err, response, body) => {
    if (err) {
      return reject(err);
    }
    if (response.statusCode !== 200) {
      return reject(
        new Error(`Error: ${response.statusCode} Cannot get AAD signing Keys`),
      );
    }
    if (!body.keys || body.keys.lenght === 0) {
      return reject(new Error('We got no AAD signing Keys'));
    }
    const key = body.keys[0];
    cachedPemKey = rsaPublicKeyPem(key.n, key.e);
    return resolve(cachedPemKey);
  });
});

export default (host, realm) => (req, token, done) => {
  const jwksUrl = `${host}/auth/realms/${realm}/protocol/openid-connect/certs`;
  getPemKey(jwksUrl).then(pemKey => done(null, pemKey));
};
