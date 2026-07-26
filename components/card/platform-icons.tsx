import type { ReactNode, SVGProps } from "react";

import { Globe, Mail, MapPin, MessageCircle, Phone, type LucideProps } from "lucide-react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number | string;
  strokeWidth?: number | string;
};

function BrandIcon({
  children,
  className,
  size = 24,
  strokeWidth = 1.75,
  ...props
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Former Lucide Instagram mark — removed from lucide-react v1 brand set. */
export function InstagramIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </BrandIcon>
  );
}

/** Former Lucide LinkedIn mark — removed from lucide-react v1 brand set. */
export function LinkedinIcon(props: IconProps) {
  return (
    <BrandIcon {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </BrandIcon>
  );
}

/**
 * X platform mark as a filled monochrome glyph. Lucide's `X` is a close
 * control, not the social mark.
 */
export function XPlatformIcon({ className, size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export type PlatformIcon = (props: LucideProps | IconProps) => ReactNode;

export function iconForLinkPlatform(platform: string): PlatformIcon {
  switch (platform) {
    case "phone":
      return Phone;
    case "email":
      return Mail;
    case "address":
      return MapPin;
    case "website":
      return Globe;
    case "whatsapp":
      return MessageCircle;
    case "instagram":
      return InstagramIcon;
    case "linkedin":
      return LinkedinIcon;
    case "x":
      return XPlatformIcon;
    default:
      return Globe;
  }
}
