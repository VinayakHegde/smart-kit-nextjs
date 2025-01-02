export type CSPWhitelist = {
  images: string[];
  scripts: string[];
  iframe: string[];
  connect: string[];
  styles: string[];
  fonts: string[];
  reports: string[];
  media: string[];
};

function generateCSPHeader(csp: CSPWhitelist): string {
  return [
    `default-src 'self';`,
    `script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: ${csp.scripts.join(' ')};`,
    `style-src 'self' 'unsafe-inline' blob: data: ${csp.styles.join(' ')};`,
    `img-src 'self' blob: data: ${csp.images.join(' ')};`,
    `font-src 'self' blob: data: ${csp.fonts.join(' ')};`,
    `object-src 'none';`,
    `base-uri 'self';`,
    `form-action 'self';`,
    `frame-ancestors 'self';`,
    `frame-src 'self' ${csp.iframe.join(' ')};`,
    `connect-src 'self' ${csp.connect.join(' ')};`,
    `media-src 'self' ${csp.media.join(' ')};`,
    `report-uri ${csp.reports.join(' ')};`,
    `report-to default;`,
  ].join(' ');
}

/**
 * securityHeaders function returns an async function that returns an array of headers with the correct values
 * @param cspWhitelist of type CSPWhitelist
 * @param stsMaxAge default value is 31536000
 * @returns  async function that returns an array of headers with the correct values
 * @example
 * ```ts
 * import { CSPWhitelist, securityHeaders } from '@vinayakhegde/smart-kit-nextjs/node/security-headers';
 *
 * const cspWhitelist: CSPWhitelist = {
 *   images: ['images.com'],
 *   scripts: ['scripts.com'],
 *   iframe: ['iframe.com'],
 *   connect: ['connect.com'],
 *   styles: ['styles.com'],
 *   fonts: ['fonts.com'],
 *   reports: ['reports.com'],
 *   media: ['media.com'],
 * };
 *
 * const headers = securityHeaders(cspWhitelist);
 *
 * // next.config.js
 * const nextConfig = {
 *   // other next config,
 *   headers,
 * };
 */
export const securityHeaders = (
  cspWhitelist: CSPWhitelist,
  stsMaxAge = 31536000,
) => {
  const cspHeader = generateCSPHeader(cspWhitelist);
  return async (): Promise<
    Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  > => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspHeader,
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
          value: `max-age=${stsMaxAge}; includeSubDomains`,
        },
        {
          key: 'Feature-Policy',
          value: "geolocation 'none'",
        },
      ],
    },
  ];
};
