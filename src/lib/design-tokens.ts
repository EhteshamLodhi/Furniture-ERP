/**
 * Design System Tokens — "The Architectural Ledger"
 * Derived from the Stitch UI design system.
 * M3-inspired tonal palette with furniture/manufacturing aesthetics.
 */

export const colors = {
  primary: '#002046',
  'primary-container': '#1b365d',
  'on-primary': '#ffffff',
  'on-primary-container': '#87a0cd',
  'on-primary-fixed': '#001b3d',
  'on-primary-fixed-variant': '#2e476f',
  'primary-fixed': '#d6e3ff',
  'primary-fixed-dim': '#aec7f7',

  secondary: '#006a6a',
  'secondary-container': '#90efef',
  'secondary-fixed': '#93f2f2',
  'secondary-fixed-dim': '#76d6d5',
  'on-secondary': '#ffffff',
  'on-secondary-container': '#006e6e',
  'on-secondary-fixed': '#002020',
  'on-secondary-fixed-variant': '#004f4f',

  tertiary: '#321c00',
  'tertiary-container': '#4f2f00',
  'tertiary-fixed': '#ffddb9',
  'tertiary-fixed-dim': '#f1bd81',
  'on-tertiary': '#ffffff',
  'on-tertiary-container': '#c6965e',
  'on-tertiary-fixed': '#2b1700',
  'on-tertiary-fixed-variant': '#623f0f',

  error: '#ba1a1a',
  'error-container': '#ffdad6',
  'on-error': '#ffffff',
  'on-error-container': '#93000a',

  background: '#f8f9fa',
  'on-background': '#191c1d',
  surface: '#f8f9fa',
  'surface-bright': '#f8f9fa',
  'surface-dim': '#d9dadb',
  'surface-variant': '#e1e3e4',
  'surface-tint': '#465f88',
  'surface-container': '#edeeef',
  'surface-container-low': '#f3f4f5',
  'surface-container-high': '#e7e8e9',
  'surface-container-highest': '#e1e3e4',
  'surface-container-lowest': '#ffffff',
  'on-surface': '#191c1d',
  'on-surface-variant': '#44474e',

  outline: '#74777f',
  'outline-variant': '#c4c6cf',

  'inverse-primary': '#aec7f7',
  'inverse-surface': '#2e3132',
  'inverse-on-surface': '#f0f1f2',
} as const;

export const fonts = {
  headline: ['Manrope', 'sans-serif'],
  body: ['Inter', 'sans-serif'],
  label: ['Inter', 'sans-serif'],
} as const;

export const borderRadius = {
  DEFAULT: '0.125rem',
  lg: '0.25rem',
  xl: '0.5rem',
  full: '0.75rem',
} as const;
