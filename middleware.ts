import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-hashes';
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data: https://c.clarity.ms https://www.google.com.co https://www.google.com https://c.bing.com/c.gif https://dev.visualwebsiteoptimizer.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
    connect-src 'self' https://api.segment.io https://cdn.segment.com https://l.clarity.ms https://analytics.google.com https://stats.g.doubleclick.net https://www.google.com https://google.com https://www.google-analytics.com;
    frame-src 'self' https://td.doubleclick.net https://www.googletagmanager.com https://meetings.hubspot.com;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}