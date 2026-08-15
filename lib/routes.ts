export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  share: "/dashboard/share",
  analytics: "/dashboard/analytics",
  invites: "/dashboard/invites",
  settings: "/settings",
  profileEdit: "/profile/edit",
  profileLinks: "/profile/links",
  profileSkills: "/profile/skills",
  profileAvatar: "/profile/avatar",
  profileBank: "/profile/bank",
  profileBilling: "/profile/billing",
  profileDocuments: "/profile/documents",
  profileDocumentFile: (documentId: string) => `/profile/documents/${documentId}/file`,
  authCallback: "/auth/callback",
  authConfirm: "/auth/confirm",
  publicCard: (publicId: string) => `/p/${publicId}`,
  publicVcard: (publicId: string) => `/p/${publicId}/vcard`,
  publicDocument: (publicId: string, documentId: string) =>
    `/p/${publicId}/documents/${documentId}`,
} as const;

/** Path prefixes that require an authenticated session. */
export const PROTECTED_PREFIXES = ["/dashboard", "/settings", "/profile"] as const;

/** Auth entry points that an already signed-in user should be bounced away from. */
export const AUTH_ENTRY_ROUTES = ["/login", "/register", "/forgot-password"] as const;
