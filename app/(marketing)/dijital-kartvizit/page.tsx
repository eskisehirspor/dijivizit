import { LandingPage, landingMetadata } from "@/components/marketing/landing-page";
import { getLanding } from "@/lib/marketing/landings";

const landing = getLanding("dijital-kartvizit");

export const metadata = landingMetadata(landing);

export default function Page() {
  return <LandingPage landing={landing} />;
}
