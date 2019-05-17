const validToken =
  'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJIaWgxa25qbEhUVlU0VWt6MjYxLVlkY0ZPdHFYR2pxNzVYaXdUTzVodVZvIn0.eyJqdGkiOiI4Y2QxYjVhYy1hZDI2LTQyNzUtOGE1Mi1jYmNiZDE2MTc3NzIiLCJleHAiOjE1NTc5NTY2MTksIm5iZiI6MCwiaWF0IjoxNTU3OTU2NTU5LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwiYXVkIjoidGVzdC10ZXN0Iiwic3ViIjoiMTQ1NzBhMmUtOTAxYS00YWZlLTk2NDQtY2RlYmU1YWVlYWI3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoidGVzdC10ZXN0IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiYzMxYTI1YjktYWUwZS00MGI5LWEyYjgtNWFjMjIyY2YyMzRlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJlbWFpbCBwcm9maWxlIiwiY2xpZW50SG9zdCI6IjE3Mi4yMS4wLjEiLCJjbGllbnRJZCI6InRlc3QtdGVzdCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LXRlc3QtdGVzdCIsImNsaWVudEFkZHJlc3MiOiIxNzIuMjEuMC4xIiwiZW1haWwiOiJzZXJ2aWNlLWFjY291bnQtdGVzdC10ZXN0QHBsYWNlaG9sZGVyLm9yZyJ9.w6UBzOpBbSxCn4qSz-4pPtDrw_lC_WF0HZM75NWtZtLu2sCU5h8wHre9VUirb6Cp_qa9cD2PpNPOoW41tQNADOqN3BS8bxoXrLgiClq9HTJ-dbfQyP7tqyVNQVRg3z8YV01qWTrJy4jvmBhpqwMZlIh0-gRyiVA1FL3uwDAAqiSID0umx3c8xa7D3b7Trcci63DHI3z3op5X8ufk5S0eVv52PKlfLnR8AO_aCD9tK-CNZuy0kiuo22y4gCoxMjV2kWjRetycKcc7pJiWgeHzB8XRuNwbWi0isGn9hLR-1JOdZCT8TmKoQrgMlAgmnJc793-u2acVva_9e8eEGar8VQ'

const validPem = `-----BEGIN RSA PUBLIC KEY-----
MIIBCgKCAQEA0mskRfrLz1wP6d+MS3yXhTECW+yLwK/K2lMp+LHUTUp6lqWbArQx
tZMTysUcGObanLJodctGwcezATlPhTGARN/zCrEJc7cwYrdjL5pzgQIQRApImqtY
uMe0ZIn9WRMSjYoTWH+cJrzN/WEyV4TB78r3ZT+0KgZumSD+uwFfBVi4uFQQSF5f
rTuZZUr9JxPXNddXrLLQNdTkCo/aH9rZgdiCaQwbKUYvr1xHqbLT+OY5LFy0Zc/E
sbKJey5sTmhhfrYs9PhUpR+MvOCrMHcnxnINAO6LeBk7WlW3Y5dXV74yeq5e6UDr
a0YeJcNp6PHRhMHi15qLRKEKqtx2DELT2wIDAQAB
-----END RSA PUBLIC KEY-----
`

const jwksResponse = {
  keys: [
    {
      kid: 'Hih1knjlHTVU4Ukz261-YdcFOtqXGjq75XiwTO5huVo',
      kty: 'RSA',
      alg: 'RS256',
      use: 'sig',
      n:
        '0mskRfrLz1wP6d-MS3yXhTECW-yLwK_K2lMp-LHUTUp6lqWbArQxtZMTysUcGObanLJodctGwcezATlPhTGARN_zCrEJc7cwYrdjL5pzgQIQRApImqtYuMe0ZIn9WRMSjYoTWH-cJrzN_WEyV4TB78r3ZT-0KgZumSD-uwFfBVi4uFQQSF5frTuZZUr9JxPXNddXrLLQNdTkCo_aH9rZgdiCaQwbKUYvr1xHqbLT-OY5LFy0Zc_EsbKJey5sTmhhfrYs9PhUpR-MvOCrMHcnxnINAO6LeBk7WlW3Y5dXV74yeq5e6UDra0YeJcNp6PHRhMHi15qLRKEKqtx2DELT2w',
      e: 'AQAB'
    }
  ]
}

const oidcMetadata = {
  issuer: 'http://localhost:8080/auth/realms/master',
  authorization_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/auth',
  token_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/token',
  token_introspection_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/token/introspect',
  userinfo_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/userinfo',
  end_session_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/logout',
  jwks_uri:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/certs',
  check_session_iframe:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/login-status-iframe.html',
  grant_types_supported: [
    'authorization_code',
    'implicit',
    'refresh_token',
    'password',
    'client_credentials'
  ],
  response_types_supported: [
    'code',
    'none',
    'id_token',
    'token',
    'id_token token',
    'code id_token',
    'code token',
    'code id_token token'
  ],
  subject_types_supported: ['public', 'pairwise'],
  id_token_signing_alg_values_supported: [
    'ES384',
    'RS384',
    'HS256',
    'HS512',
    'ES256',
    'RS256',
    'HS384',
    'ES512',
    'RS512'
  ],
  userinfo_signing_alg_values_supported: [
    'ES384',
    'RS384',
    'HS256',
    'HS512',
    'ES256',
    'RS256',
    'HS384',
    'ES512',
    'RS512',
    'none'
  ],
  request_object_signing_alg_values_supported: ['none', 'RS256'],
  response_modes_supported: ['query', 'fragment', 'form_post'],
  registration_endpoint:
    'http://localhost:8080/auth/realms/master/clients-registrations/openid-connect',
  token_endpoint_auth_methods_supported: [
    'private_key_jwt',
    'client_secret_basic',
    'client_secret_post',
    'client_secret_jwt'
  ],
  token_endpoint_auth_signing_alg_values_supported: ['RS256'],
  claims_supported: [
    'sub',
    'iss',
    'auth_time',
    'name',
    'given_name',
    'family_name',
    'preferred_username',
    'email'
  ],
  claim_types_supported: ['normal'],
  claims_parameter_supported: false,
  scopes_supported: [
    'openid',
    'phone',
    'address',
    'email',
    'profile',
    'offline_access'
  ],
  request_parameter_supported: true,
  request_uri_parameter_supported: true,
  code_challenge_methods_supported: ['plain', 'S256'],
  tls_client_certificate_bound_access_tokens: true,
  introspection_endpoint:
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/token/introspect'
}

module.exports = { jwksResponse, validPem, validToken, oidcMetadata }
