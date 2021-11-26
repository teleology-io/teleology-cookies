// Useful link: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

const CLEAR_SUFFIX = `=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

export const SameSite = {
  STRICT: 'Strict',
  LAX: 'Lax',
  NONE: 'None',
};

const SAME_SITE_VALUES = Object.values(SameSite);

enum Expiry {
  SESSION = 'Session',
}

type Options = {
  key: string,
  value: any,
  maxAge?: number,
  expires?: string | Expiry,
  path?: string,
  secure?: boolean,
  urlEncode: boolean
}

type ClientOptions = Options & {}

type ServerOptions = Options & {
  domain?: string,
  httpOnly?: boolean,
  sameSite?: string,
}

// @ts-ignore
const FILTER_INVALID = ([_, v]) => !!v;

// @ts-ignore
const sanitizeValue = ({ urlEncode = false, value }) => {
  const v = `${urlEncode ? encodeURIComponent(value) : value}`;
  const invalid = [
    /\(/g,
    /\)/g,
    /</g,
    />/g,
    /@/g,
    /,/g,
    /:/g,
    /;/g,
    /\\/g,
    /\"/g,
    /\//g,
    /\[/g,
    /\]/g,
    /\?/g,
    /=/g,
    /{/g,
    /}/g,
    /\s/g,
    /\c/g,
  ];

  for (const i of invalid) {
    if (i.test(v)) {
      throw new Error(`Invalid character failed with RegExp ${i}`);
    }
  }

  return v;
}

export const get = (key: string) => {
  const cookie = document.cookie
    .split('; ')
    .find((it) => it.indexOf(`${key}=`) === 0);
  if (cookie) {
    return cookie.split('=')[1];
  }
};

export const set = ({
  key,
  value,
  maxAge,
  expires,
  path,
  secure,
  urlEncode = false
}: ClientOptions) => {
  const args = {
    [key]: sanitizeValue({ value, urlEncode }),
    'max-age': maxAge,
    expires,
    path,
    secure,
  };

  const valid = Object.entries(args).filter(FILTER_INVALID);
  document.cookie = valid.map(([k, v]) => `${k}=${v};`).join(' ');
};

export const clear = (key: string) => {
  document.cookie = `${key}${CLEAR_SUFFIX}`;
};

export const header = ({
  key,
  value,
  maxAge,
  expires,
  domain,
  path,
  secure,
  httpOnly,
  sameSite,
  urlEncode = false
}: ServerOptions) => {
  const args = {
    [key]: sanitizeValue({ value, urlEncode }),
    'Max-Age': maxAge,
    Expires: expires,
    Domain: domain,
    Path: path,
    SameSite: sameSite,
  };

  if (sameSite && SAME_SITE_VALUES.indexOf(sameSite) === -1) {
    throw new Error(
      `Invalid SameSite value ${sameSite}\nExpected: ${SAME_SITE_VALUES.join(
        ' ',
      )}`,
    );
  }

  const valid = Object.entries(args).filter(FILTER_INVALID);

  // Map to key-value
  const keys = valid.map(([k, v]) => `${k}=${v}`);

  if (secure) {
    keys.push('Secure');
  }

  if (httpOnly) {
    keys.push('HttpOnly');
  }

  if (sameSite === SameSite.NONE && !secure) {
    throw new Error(`When SameSite value is 'None', Secure must be set`);
  }

  return keys.join('; ');
}
