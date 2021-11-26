# @teleology/cookies

A slim implementation for client+server to handle coookies

## Installation

```
yarn add @teleology/cookies
```

## Attribute Options
| Attribute | Description | Type | Environment |
|--|--|--|--|
| key | The name of the cookie | string | Client & Server |
| value | The value of the cookie (will be coerced) | any | Client & Server |
| maxAge | The number of seconds until the cookie expires | number | Client & Sever | 
| expires | A HTTP-date timestamp when the cookie expires | string or ('Session') | Client & Server |
| path | The path necessary for the server to send a cookie | string | Client & Server |
| secure | Cookies are only sent during HTTPS requests | boolean | Client & Sever |
| httpOnly | Prevents Javascript from accessing the cookie | boolean | Server Only |
| sameSite | Whether or not a cookie is sent with CORS | 'Strict' or 'Lax' or 'None' | Server Only |
| urlEncode | Whether to encode the cookie value | boolean | 

## Client Usage
```javascript
import * as cookies from '@teleology/cookies';

cookies.set({
  key: 'access_token',
  value: 'aGVsbG8gd29ybGQK...',
  maxAge: 3600,
  secure: true
});

cookies.get('access_token')

cookies.clear('access_token');
```

## Server Usage
```javascript
const cookies = require('@teleology/cookies');


const handleLogin = async (args) => {
  let access_token;
  // ... get access token

  const setCookie = cookies.header({
    key: 'access_token',
    value: access_token,
    maxAge: 3600,
    domain: 'example.com',
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: cookies.SameSite.STRICT,
  });

  // access_token=aGVsbG8gd29ybGQK...; Max-Age=3600; Domain=example.com; Path=/; SameSite=Strict; Secure; HttpOnly

  return {
    statusCode: 200,
    headers: {
      'Set-Cookie': setCookie,
    },
    body: {
      access_token,
      expires_in: 3600,

      // ...
    }
  }
}
```


### Changelog

**1.0.0**
- Initial publications