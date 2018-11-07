import { passport, expect } from 'chai';
import nock from 'nock';
import KeycloakBearerStrategy from '../src';

const options = {
  realm: 'realm',
  host: 'https://host.com',
  clientId: 'clientId',
};
const validToken = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIybHlNR3JGMzlfRHBXal85VVZsalRFUTZrWi03XzIwRW5jY3M1UEoxTmdrIn0.eyJqdGkiOiJmNGM3OWQwMS03MTE1LTRkYWItYmZjYS1jOTc3OGM5N2I1ODAiLCJleHAiOjE1NDE1MjkxODUsIm5iZiI6MCwiaWF0IjoxNTQxNTI5MTI1LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoidGVzdC10ZXN0Iiwic3ViIjoiYjIwOTE2ZjUtNzEwNC00NzFlLWExZjgtZDg1N2NlOWI3Y2MzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidGVzdC10ZXN0IiwiYXV0aF90aW1lIjoxNTQxNTI5MTI0LCJzZXNzaW9uX3N0YXRlIjoiNGNiMGQ2YTgtMTVmZi00MDk0LTgyYmEtYjIxMWZhYmZhNWE3IiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJjcmVhdGUtcmVhbG0iLCJvZmZsaW5lX2FjY2VzcyIsImFkbWluIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiU2ltZW4gR3Jhbmx1bmQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZG1pbiIsImdpdmVuX25hbWUiOiJTaW1lbiIsImZhbWlseV9uYW1lIjoiR3Jhbmx1bmQiLCJlbWFpbCI6InNpbWVuQGhncmFubHVuZC5jb20ifQ.oXiQxkEdNLdKKJd_RK2NVzRxC9ofJ453_q_vkv7Te0tbHJlBlzJY2QdRadsYu1A8Wyk8e13DYDqxa5zifmiLRA_BwbZ1NARW7PCpuKq7QtLphmIcOZGT6_De0psh6UYioSGh2GkNYyGLEdU3T4RQK3dROsQMok6C4qD442EvoJ2M0VcPGPvYQQv-AWpdSq3M-oXIcYOos0WkM6BpTfWzQqCHuIr8u2-XCptZad-vmM3uNVU-wYYJpU4RAuKvUdzfWYUkDr0h0DhbP7qKiuo1f-mgq17qwOQflFrBj6IKuxy5R25caNBYx1el3_68_T3car_0E8uUyurnWqhCohtAtA';


describe('KeycloakBearerStrategy', () => {
  describe('failing a request in user-callback', () => {
    const strategy = new KeycloakBearerStrategy(options, ((verifidToken, done) => done(null, false, 'The access token expired')));
    let challenge;

    before((done) => {
      nock(options.host)
        .get(`/auth/realms/${options.realm}/protocol/openid-connect/userinfo`)
        .reply(200);
      passport.use(strategy)
        .fail((c) => {
          challenge = c;
          done();
        })
        .req((req) => {
          req.headers.authorization = `Bearer ${validToken}`;
        })
        .authenticate();
    });

    it('should fail with challenge', () => {
      expect(challenge).to.be.a('string');
      expect(challenge).to.equal('error: The access token expired');
    });
  });

  describe('handling a request with wrong token', () => {
    let challenge;
    const strategy = new KeycloakBearerStrategy(options, ((verifidToken, done) => {
      if (verifidToken) {
        return done(null, verifidToken.content, { scope: 'read' });
      }
      return done(null, false);
    }));
    before((done) => {
      nock(options.host)
        .get(`/auth/realms/${options.realm}/protocol/openid-connect/userinfo`)
        .reply(200);

      passport.use(strategy)
        .fail((c) => {
          challenge = c;
          done();
        })
        .req((req) => {
          req.headers.authorization = 'Bearer WRONG';
        })
        .authenticate();
    });

    it('should fail with challenge', () => {
      expect(challenge).to.be.a('string');
      expect(challenge).to.equal('Token is malformed');
    });
  });
});
