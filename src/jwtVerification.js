import axios from 'axios';
import jwt from 'jsonwebtoken';
import Token from './token';

export default class JwtVerification {
  constructor(options) {
    this.options = options;
    this.request = axios.create({
      baseURL: options.host,
    });
  }

  verifyOffline(accessToken, options = {}) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, this.cert, options, (err) => {
        if (err) reject(err);
        resolve(new Token(accessToken));
      });
    });
  }

  verify(accessToken) {
    return new Promise((resolve, reject) => {
      this.request.get(
        `/auth/realms/${this.options.realm}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ).then(() => {
        const token = new Token(accessToken);
        resolve(token);
      }).catch((err) => {
        reject(err);
      });
    });
  }
}
