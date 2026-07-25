export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  dashboard: "/dashboard",
  settings: "/settings",
  profileEdit: "/profile/edit",
  authCallback: "/auth/callback",
  authConfirm: "/auth/confirm",
  publicCard: (publicId: string) => `/p/${publicId}`,
} as const;

/** Path prefixes that require an authenticated session. */
export const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/profile"] as const;

/** Auth entry points that an already signed-in user should be bounced away from. */
export const AUTH_ENTRY_ROUTES = ["/login", "/register"] as const;
