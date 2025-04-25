
export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
} as const;

export type AppRoute = typeof ROUTES[keyof typeof ROUTES];
