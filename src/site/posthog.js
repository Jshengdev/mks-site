import posthog from 'posthog-js'

// Initialize PostHog — replace with real project key before production
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

export function initPostHog() {
  if (!POSTHOG_KEY) return
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
  })
}

export function trackVariation(variationName) {
  if (!POSTHOG_KEY) return
  posthog.capture('site_variation_viewed', { variation: variationName })
}

export { posthog }
