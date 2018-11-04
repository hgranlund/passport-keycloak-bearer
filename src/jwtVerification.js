import axios from 'axios';
import jwt from 'jsonwebtoken';
import Token from './token';

export default class JwtVerification {
  constructor(config) {
    this.config = config;
    this.request = axios.create({
      baseURL: config.host
    });
  }

  verifyOffline(accessToken, cert, options = {}) {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, cert, options, err => {
        if (err) reject(err);
        resolve(new Token(accessToken));
      });
    });
  }

  async verify(accessToken) {
    const userResponse = await this.request.get(
      `/auth/realms/${this.config.realm}/protocol/openid-connect/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    return { token: new Token(accessToken), user: userResponse.data };
  }
}
