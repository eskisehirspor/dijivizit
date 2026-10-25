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
  cardPreview: "/dashboard/preview",
  invites: "/dashboard/invites",
  cards: "/dashboard/cards",
  appleWallet: (slug: string) => `/dashboard/wallet/${slug}`,
  team: "/dashboard/team",
  scanCard: "/dashboard/contacts/scan",
  contacts: "/dashboard/contacts",
  contactNew: "/dashboard/contacts/new",
  contact: (contactId: string) => `/dashboard/contacts/${contactId}`,
  contactsExport: "/dashboard/contacts/export",
  admin: "/dashboard/admin",
  adminUser: (userId: string) => `/dashboard/admin/users/${userId}`,
  settings: "/settings",
  profileEdit: "/profile/edit",
  profileLinks: "/profile/links",
  profileSkills: "/profile/skills",
  profileAvatar: "/profile/avatar",
  profileBank: "/profile/bank",
  profileBilling: "/profile/billing",
  profileDocuments: "/profile/documents",
  profileDocumentFile: (documentId: string) => `/profile/documents/${documentId}/file`,
  legal: (slug: "kvkk" | "gizlilik" | "kullanim-kosullari") => `/yasal/${slug}`,
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
