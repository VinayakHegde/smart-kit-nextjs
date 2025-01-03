import { CSPWhitelist, securityHeaders } from './security-headers';

test('should return an array of headers with the correct values', async () => {
  const cspWhitelist: CSPWhitelist = {
    images: ['images.com'],
    scripts: ['scripts.com'],
    iframe: ['iframe.com'],
    connect: ['connect.com'],
    styles: ['styles.com'],
    fonts: ['fonts.com'],
    reports: ['reports.com'],
    media: ['media.com'],
  };

  const expectedHeaders = [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self' unsafe-eval unsafe-inline blob: scripts.com; style-src 'self' unsafe-inline blob: data: styles.com; img-src 'self' blob: data: images.com; font-src 'self' blob: data: fonts.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' iframe.com; connect-src 'self' connect.com; media-src 'self' media.com; report-uri reports.com; report-to default;",
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=12345; includeSubDomains',
        },
        {
          key: 'Feature-Policy',
          value: "geolocation 'none'",
        },
      ],
    },
  ];

  const headersGenerator = securityHeaders(cspWhitelist, {
    allowUnsafeEval: true,
    allowUnsafeInline: true,
    stsMaxAge: 12345,
  });

  const result = await headersGenerator();
  expect(result).toEqual(expectedHeaders);
});

test('should return an array of headers with the correct values when options are not provided', async () => {
  const cspWhitelist: CSPWhitelist = {
    images: ['images.com'],
    scripts: ['scripts.com'],
    iframe: ['iframe.com'],
    connect: ['connect.com'],
    styles: ['styles.com'],
    fonts: ['fonts.com'],
    reports: ['reports.com'],
    media: ['media.com'],
  };

  const expectedHeaders = [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self'   blob: scripts.com; style-src 'self'  blob: data: styles.com; img-src 'self' blob: data: images.com; font-src 'self' blob: data: fonts.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' iframe.com; connect-src 'self' connect.com; media-src 'self' media.com; report-uri reports.com; report-to default;",
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'Feature-Policy',
          value: "geolocation 'none'",
        },
      ],
    },
  ];

  const headersGenerator = securityHeaders(cspWhitelist);

  const result = await headersGenerator();
  expect(result).toEqual(expectedHeaders);
});

test('should return header when no params passed in', async () => {
  const headersGenerator = securityHeaders();
  expect(headersGenerator).toBeDefined();

  const result = await headersGenerator();
  expect(result).toEqual([
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value:
            "default-src 'self'; script-src 'self'   blob: ; style-src 'self'  blob: data: ; img-src 'self' blob: data: ; font-src 'self' blob: data: ; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; frame-src 'self' ; connect-src 'self' ; media-src 'self' ; report-uri ; report-to default;",
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains',
        },
        {
          key: 'Feature-Policy',
          value: "geolocation 'none'",
        },
      ],
    },
  ]);
});
